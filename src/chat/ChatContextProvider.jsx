import { useCallback, useContext, useEffect, useRef, useState } from "react";
import api from "@/api/axios";
import { ChatContext } from "./ChatContext";
import { UserContext } from "../user/UserContext";
import { io } from "socket.io-client";

export const ChatContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  console.log("onlineUsers", onlineUsers);
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socketRef.current || !user) return;
    socketRef.current.emit("addNewUser", user?.data?.Id);
    socketRef.current.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socketRef.current.off("getOnlineUsers");
    };
  }, [user]);

  // envia a mensagem
  useEffect(() => {
    if (!newMessage || !socketRef.current || !user || !currentChat) return;

    const recipientId =
      currentChat?.user1Id !== user?.data.Id
        ? currentChat?.user1Id
        : currentChat?.user2Id;

    socketRef.current.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage, currentChat, user]);

  // recebe a mensagem

  useEffect(() => {
    if (!user || !socketRef.current) return;

    const handleMessage = (res) => {
      if (currentChat?.id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    };
    socketRef.current.on("getMessage", handleMessage);

    return () => {
      socketRef.current.off("getMessage", handleMessage);
    };
  }, [currentChat, user]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get("/user");
        const existingUsers = new Set(
          userChats?.map((chat) =>
            chat.user1Id === user.data.Id ? chat.user2Id : chat.user1Id,
          ),
        );

        const pChats = response.data.data.filter((u) => {
          return u.id !== user.data.Id && !existingUsers.has(u.id);
        });

        setPotentialChats(pChats);
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, [userChats, user]);

  useEffect(() => {
    if (!user?.data?.Id) return;

    const getUserChats = async () => {
      try {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await api.get(`/chat/${user.data.Id}`);

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response");
        }

        setUserChats(response.data);
      } catch (error) {
        console.log(error);
        setUserChatsError(error);
      } finally {
        setIsUserChatsLoading(false);
      }
    };

    getUserChats();
  }, [user?.data?.Id]);

  useEffect(() => {
    if (!currentChat?.id) return;

    const getMessages = async () => {
      try {
        setIsMessagesLoading(true);
        setMessagesError(null);

        const response = await api.get(`/messages/${currentChat.id}`);

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response");
        }

        setMessages(response.data);
      } catch (error) {
        console.log(error);
        setMessagesError(error);
      } finally {
        setIsMessagesLoading(false);
      }
    };

    getMessages();
  }, [currentChat?.id]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage.trim()) return;

      try {
        const response = await api.post("/messages", {
          senderId: sender.Id,
          chatId: currentChatId,
          text: textMessage,
        });

        setMessages((prev) => {
          const exists = prev.some((m) => m.id === response.data.id);

          if (exists) return prev;

          return [...prev, response.data];
        });

        setNewMessage(response.data);

        setTextMessage("");
      } catch (error) {
        console.log(error);
        setSendTextMessageError(error);
      }
    },
    [],
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    if (!firstId || !secondId) return;

    try {
      const response = await api.post("/chat", {
        firstId,
        secondId,
      });

      setUserChats((prev) => {
        const exists = prev.some(
          (chat) =>
            (chat.user1Id === firstId && chat.user2Id === secondId) ||
            (chat.user1Id === secondId && chat.user2Id === firstId),
        );

        if (exists) return prev;

        return [...prev, response.data];
      });
    } catch (error) {
      console.log("Error creating chat", error);
    }
  }, []);
  const clearChats = useCallback(() => {
    setCurrentChat(null);
    setMessages([]);
    setUserChats([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        updateCurrentChat,
        currentChat,
        createChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        sendTextMessageError,
        clearChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
