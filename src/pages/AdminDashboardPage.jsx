import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  Users,
  Briefcase,
  ShieldAlert,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";

const AdminDashboardPage = ({ navigate }) => {
  const { userInfo, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState({ users: [], gigs: [], orders: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (tab) => {
      if (!userInfo?.token) return;
      setLoading(true);
      try {
        let result;
        if (tab === "users") {
          result = await apiService.adminGetAllUsers(userInfo.token);
          setData((d) => ({ ...d, users: result }));
        } else if (tab === "gigs") {
          result = await apiService.adminGetAllGigs(userInfo.token);
          setData((d) => ({ ...d, gigs: result }));
        } else if (tab === "disputes") {
          result = await apiService.adminGetDisputedOrders(userInfo.token);
          setData((d) => ({ ...d, orders: result }));
        }
      } catch (error) {
        toast.error(error.message || `Failed to fetch ${tab}.`);
      } finally {
        setLoading(false);
      }
    },
    [userInfo?.token]
  );

  useEffect(() => {
    if (!isAuthenticated || userInfo?.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("home");
    } else {
      fetchData(activeTab);
    }
  }, [isAuthenticated, userInfo, navigate, fetchData, activeTab]);

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This is irreversible."
      )
    ) {
      try {
        await apiService.adminDeleteUser(userId, userInfo.token);
        toast.success("User deleted successfully.");
        fetchData("users");
      } catch (error) {
        toast.error(error.message || "Failed to delete user.");
      }
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (window.confirm("Are you sure you want to delete this gig?")) {
      try {
        await apiService.adminDeleteGig(gigId, userInfo.token);
        toast.success("Gig deleted successfully.");
        fetchData("gigs");
      } catch (error) {
        toast.error(error.message || "Failed to delete gig.");
      }
    }
  };

  const handleResolveOrder = async (orderId, newStatus) => {
    const confirmationText =
      newStatus === "Completed" ? "force-complete" : "cancel";
    if (
      window.confirm(`Are you sure you want to ${confirmationText} this order?`)
    ) {
      try {
        await apiService.adminResolveOrder(orderId, newStatus, userInfo.token);
        toast.success(`Order has been resolved as ${newStatus}.`);
        fetchData("disputes");
      } catch (error) {
        toast.error(error.message || "Failed to resolve order.");
      }
    }
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner message={`Loading ${activeTab}...`} />;

    switch (activeTab) {
      case "users":
        return <UserTable users={data.users} onDelete={handleDeleteUser} />;
      case "gigs":
        return <GigTable gigs={data.gigs} onDelete={handleDeleteGig} />;
      case "disputes":
        return (
          <DisputeTable orders={data.orders} onResolve={handleResolveOrder} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
              <TabButton
                icon={<Users />}
                label="Users"
                tabName="users"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                count={data.users.length}
              />
              <TabButton
                icon={<Briefcase />}
                label="Gigs"
                tabName="gigs"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                count={data.gigs.length}
              />
              <TabButton
                icon={<ShieldAlert />}
                label="Disputes"
                tabName="disputes"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                count={data.orders.length}
              />
            </nav>
          </div>
          <div className="p-1 sm:p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({
  icon,
  label,
  tabName,
  activeTab,
  setActiveTab,
  count,
}) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`${
      activeTab === tabName
        ? "border-purple-500 text-purple-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
  >
    {icon}
    <span className="ml-2">{label}</span>
    {count > 0 && (
      <span className="ml-2 bg-purple-100 text-purple-600 rounded-full px-2 py-0.5 text-xs font-semibold">
        {count}
      </span>
    )}
  </button>
);

const UserTable = ({ users, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            User
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Role
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Joined
          </th>
          <th className="relative px-6 py-3"></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user._id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={
                      user.profilePicture ||
                      `https://placehold.co/40x40/cccccc/333333?text=${user.username.charAt(
                        0
                      )}`
                    }
                    alt=""
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.username}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.role}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <Button
                variant="danger"
                className="!p-2"
                onClick={() => onDelete(user._id)}
              >
                <Trash2 size={16} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const GigTable = ({ gigs, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Gig
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Seller
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Price
          </th>
          <th className="relative px-6 py-3"></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {gigs.map((gig) => (
          <tr key={gig._id}>
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900">
                {gig.title}
              </div>
              <div className="text-sm text-gray-500">{gig.category}</div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {gig.seller?.username}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              ${gig.price.toFixed(2)}
            </td>
            <td className="px-6 py-4 text-right">
              <Button
                variant="danger"
                className="!p-2"
                onClick={() => onDelete(gig._id)}
              >
                <Trash2 size={16} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DisputeTable = ({ orders, onResolve }) => {
  const [expandedRowId, setExpandedRowId] = useState(null);

  const toggleRow = (orderId) => {
    setExpandedRowId(expandedRowId === orderId ? null : orderId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Participants
            </th>
            <th className="w-1/2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Dispute Reason
            </th>
            <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Details</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>
                    Buyer:{" "}
                    <span className="font-medium">{order.buyer.username}</span>
                  </div>
                  <div>
                    Seller:{" "}
                    <span className="font-medium">{order.seller.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-sm">
                  {order.disputeReason || "No reason provided."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    className="!p-2"
                    onClick={() => toggleRow(order._id)}
                  >
                    {expandedRowId === order._id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </Button>
                </td>
              </tr>
              {expandedRowId === order._id && (
                <tr className="bg-gray-50">
                  <td colSpan="4" className="px-6 py-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-gray-700">
                          Full Dispute Reason:
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                          {order.disputeReason}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-700">
                          Submitted Evidence:
                        </h4>
                        {order.disputeEvidence &&
                        order.disputeEvidence.length > 0 ? (
                          <ul className="mt-2 space-y-2">
                            {order.disputeEvidence.map((file) => (
                              <li key={file.public_id}>
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-purple-600 hover:text-purple-800 hover:underline"
                                >
                                  <FileText size={16} className="mr-2" /> View
                                  File
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1 text-sm text-gray-500 italic">
                            No evidence was submitted.
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end items-center space-x-3 pt-4 border-t border-gray-200">
                        <span className="text-sm font-medium">Resolve as:</span>
                        <Button
                          variant="primary"
                          className="!py-2 !px-3 bg-green-600 hover:bg-green-700"
                          onClick={() => onResolve(order._id, "Completed")}
                        >
                          <CheckCircle size={16} className="mr-2" /> Approve
                          (Complete)
                        </Button>
                        <Button
                          variant="danger"
                          className="!py-2 !px-3"
                          onClick={() => onResolve(order._id, "Cancelled")}
                        >
                          <XCircle size={16} className="mr-2" /> Reject (Cancel)
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboardPage;
