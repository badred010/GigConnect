import Message from "../models/Message.js";
import User from "../models/User.js";

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user._id;

  if (!receiverId || !text) {
    return res
      .status(400)
      .json({ message: "Receiver ID and message text are required" });
  }

  try {
    // Check if receiverId exists
    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: "Server error while sending message",
      error: error.message,
    });
  }
};

// @desc    Get messages between two users (sender and receiver)
// @route   GET /api/messages/:otherUserId
// @access  Private
const getMessages = async (req, res) => {
  const currentUserId = req.user._id;
  const { otherUserId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .sort("createdAt")
      .populate("sender", "username profilePicture")
      .populate("receiver", "username profilePicture");

    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching messages",
      error: error.message,
    });
  }
};

// @desc    Get list of users current user has messaged
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  const currentUserId = req.user._id;

  try {
    const sentTo = await Message.distinct("receiver", {
      sender: currentUserId,
    });
    const receivedFrom = await Message.distinct("sender", {
      receiver: currentUserId,
    });

    const chattedUserIds = [...new Set([...sentTo, ...receivedFrom])];

    const users = await User.find({ _id: { $in: chattedUserIds } }).select(
      "username profilePicture email"
    );

    const conversationsWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId },
          ],
        }).sort({ createdAt: -1 });

        return {
          otherUser: user,
          lastMessage: lastMessage,
        };
      })
    );

    res.json(conversationsWithLastMessage);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching conversations",
      error: error.message,
    });
  }
};

export { sendMessage, getMessages, getConversations };
