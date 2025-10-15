import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";

const ManageGigsPage = ({ navigate }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || userInfo?.role !== "seller") {
      toast.error("You must be a seller to view this page.");
      navigate("login");
      return;
    }

    const fetchGigs = async () => {
      try {
        setLoading(true);
        const data = await apiService.getMyGigs(userInfo.token);
        setGigs(data);
      } catch (error) {
        toast.error(error.message || "Failed to fetch your gigs.");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [isAuthenticated, userInfo, navigate]);

  const handleDelete = async (gigId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this gig? This action cannot be undone."
      )
    ) {
      try {
        await apiService.deleteGig(gigId, userInfo.token);
        toast.success("Gig deleted successfully.");
        
        setGigs(gigs.filter((gig) => gig._id !== gigId));
      } catch (error) {
        toast.error(error.message || "Failed to delete gig.");
      }
    }
  };

  const handleEdit = (gigId) => {
    
    navigate("createGig", { gigId: gigId });
  };

  if (loading) {
    return <LoadingSpinner message="Loading your gigs..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Manage Your Gigs
          </h1>
          <Button variant="primary" onClick={() => navigate("createGig")}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Gig
          </Button>
        </div>

        {gigs.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h2 className="text-xl font-medium text-gray-700">
              No gigs found.
            </h2>
            <p className="mt-2 text-gray-500">
              Get started by creating your first gig!
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {gigs.map((gig) => (
                <li key={gig._id}>
                  <div className="p-4 sm:p-6 hover:bg-gray-50 flex items-center space-x-4">
                    <img
                      className="h-24 w-24 rounded-md object-cover hidden sm:block"
                      src={gig.images[0]?.url}
                      alt={gig.title}
                    />
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-purple-700 truncate">
                        {gig.title}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <p>
                          Price:{" "}
                          <span className="font-bold">
                            ${gig.price.toFixed(2)}
                          </span>
                        </p>
                        <p className="mx-2">|</p>
                        <p>
                          Delivery:{" "}
                          <span className="font-bold">
                            {gig.deliveryTime} day(s)
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(gig._id)}
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(gig._id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageGigsPage;
