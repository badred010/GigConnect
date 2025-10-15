import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Send, ArrowLeft, UserCircle } from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import Input from "../components/Input";

const ChatPage = ({
  navigate,
  otherUserId,
  otherUserName,
  otherUserProfilePicture,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { userInfo, isAuthenticated } = useAuthStore();

  const messageContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view messages.");
      navigate("login");
      return;
    }
    if (!otherUserId) {
      toast.error("User not specified for chat.");
      navigate("messages");
      return;
    }

    let isMounted = true;
    const fetchMessages = async () => {
      try {
        const data = await apiService.getMessages(otherUserId, userInfo.token);
        if (isMounted) {
          setMessages(data);
        }
      } catch (error) {
        if (isMounted)
          toast.error(error.message || "Could not fetch messages.");
        clearInterval(intervalId);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isAuthenticated, otherUserId, userInfo?.token, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);

    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      sender: {
        _id: userInfo._id,
        username: userInfo.username,
        profilePicture: userInfo.profilePicture,
      },
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
    setNewMessage("");

    try {
      await apiService.sendMessage(
        { receiverId: otherUserId, text: newMessage },
        userInfo.token
      );
    } catch (error) {
      toast.error(error.message || "Failed to send message.");

      setMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticMessage._id)
      );
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="absolute top-16 left-0 right-0 bottom-0 flex flex-col bg-gray-100">
      <header className="flex-shrink-0 bg-purple-600 text-white p-3 sm:p-4 shadow-md z-30 flex items-center">
        <Button
          variant="outline"
          onClick={() => navigate("messages")}
          className="!p-2 !border-purple-400 !text-purple-200 hover:!bg-purple-700 mr-3"
        >
          <ArrowLeft size={20} />
        </Button>
        {otherUserProfilePicture ? (
          <img
            src={otherUserProfilePicture}
            alt={otherUserName}
            className="h-10 w-10 rounded-full object-cover mr-3 border-2 border-purple-300"
          />
        ) : (
          <UserCircle size={40} className="text-purple-300 mr-3" />
        )}
        <h1 className="text-xl font-semibold truncate">
          {otherUserName || "Chat"}
        </h1>
      </header>

      <main
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6"
      >
        {loading ? (
          <LoadingSpinner message={`Loading chat...`} />
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 pt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex items-end gap-2 ${
                  msg.sender._id === userInfo._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.sender._id !== userInfo._id && (
                  <div className="flex-shrink-0">
                    {msg.sender.profilePicture ? (
                      <img
                        src={msg.sender.profilePicture}
                        alt={msg.sender.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-xs sm:max-w-md md:max-w-lg px-4 py-2 rounded-xl shadow ${
                    msg.sender._id === userInfo._id
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm break-words">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender._id === userInfo._id
                        ? "text-purple-200"
                        : "text-gray-400"
                    } text-right`}
                  >
                    {formatTimestamp(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="flex-shrink-0 bg-white p-3 sm:p-4 border-t border-gray-200 z-10">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-3"
        >
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow !mb-0"
            disabled={sending}
          />
          <Button
            type="submit"
            variant="primary"
            className="!p-3"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? <LoadingSpinner size="sm" /> : <Send size={20} />}
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
