import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { MessageSquare, UserCircle } from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import Input from "../components/Input";

const ConversationsPage = ({ navigate }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { userInfo, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your messages.");
      navigate("login");
      return;
    }

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await apiService.getConversations(userInfo.token);

        data.sort(
          (a, b) =>
            new Date(b.lastMessage?.createdAt || 0) -
            new Date(a.lastMessage?.createdAt || 0)
        );
        setConversations(data);
      } catch (error) {
        toast.error(error.message || "Could not fetch conversations.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isAuthenticated, userInfo, navigate]);

  const filteredConversations = conversations.filter((convo) =>
    convo.otherUser.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading conversations..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
            <h1 className="text-3xl font-extrabold text-purple-700">
              Your Messages
            </h1>
          </div>

          {conversations.length > 0 && (
            <div className="mb-6">
              <Input
                type="search"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!mb-0"
              />
            </div>
          )}

          {filteredConversations.length === 0 && !loading ? (
            <div className="text-center py-10">
              <MessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-gray-700">
                No conversations yet.
              </h2>
              <p className="mt-2 text-gray-500">
                {conversations.length > 0
                  ? "No matching conversations found for your search."
                  : "Start a conversation by messaging a seller or buyer!"}
              </p>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200 -mx-6 sm:-mx-8">
              {filteredConversations.map(({ otherUser, lastMessage }) => (
                <li key={otherUser._id}>
                  <button
                    onClick={() =>
                      navigate("chat", {
                        otherUserId: otherUser._id,
                        otherUserName: otherUser.username,
                        otherUserProfilePicture: otherUser.profilePicture,
                      })
                    }
                    className="w-full text-left p-4 sm:p-6 hover:bg-purple-50 focus:outline-none focus:bg-purple-100 transition duration-150 ease-in-out"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {otherUser.profilePicture ? (
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={otherUser.profilePicture}
                            alt={otherUser.username}
                          />
                        ) : (
                          <UserCircle className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-md font-semibold text-purple-700 truncate">
                          {otherUser.username}
                        </p>
                        {lastMessage ? (
                          <p
                            className={`text-sm truncate ${
                              lastMessage.sender !== userInfo._id &&
                              !lastMessage.read
                                ? "text-gray-900 font-bold"
                                : "text-gray-500"
                            }`}
                          >
                            {lastMessage.sender === userInfo._id ? "You: " : ""}
                            {lastMessage.text}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">
                            No messages yet
                          </p>
                        )}
                      </div>
                      {lastMessage && (
                        <div className="text-xs text-gray-400 whitespace-nowrap self-start pt-1">
                          {formatTimestamp(lastMessage.createdAt)}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;
