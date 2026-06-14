import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../user/UserContext";
import { ChatContext } from "../../chat/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { IoIosSend } from "react-icons/io";

export const ChatBox = () => {
  const { user } = useContext(UserContext);
  const { currentChat, messages, isMessagesLoading, sendTextMessage } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSend = () => {
    if (!textMessage.trim()) return;
    sendTextMessage(textMessage, user.data, currentChat.id, setTextMessage);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!recipientUser)
    return (
      <p className="w-full text-center text-white">
        No conversation selected yet...
      </p>
    );

  if (isMessagesLoading)
    return <p className="w-full text-center">Loading chat...</p>;

  return (
    <div className="h-full flex flex-col gap-4 bg-zinc-900 flex-1 rounded-lg overflow-hidden">
      <div className="bg-zinc-700 w-full text-white text-center p-2 rounded-t-sm">
        <strong>{recipientUser.data.Username}</strong>
      </div>
      <div className="flex flex-col flex-1 gap-3 p-2 overflow-y-auto">
        {messages &&
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex min-w-0 ${message?.senderId === user.data.Id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  `flex flex-col w-fit max-w-[70%] px-3 py-2 text-sm leading-relaxed [overflow-wrap:anywhere]` +
                  ` ${
                    message?.senderId === user.data.Id
                      ? "bg-amber-400 text-amber-950 rounded-t-2xl rounded-l-2xl rounded-br-sm"
                      : "bg-zinc-700 text-zinc-100 rounded-t-2xl rounded-r-2xl rounded-bl-sm"
                  }`
                }
              >
                <div>{message?.text}</div>
                <span className="text-[10px] opacity-60 mt-1">
                  {moment(message.createdAt).calendar()}
                </span>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-3 w-full grow-0 self-end align pb-2 pr-3">
        <div className="flex-1 min-w-0">
          <InputEmoji
            value={textMessage}
            onChange={setTextMessage}
            onEnter={handleSend}
            cleanOnEnter
            fontFamily="munito"
            borderColor="rgba(72,112,223,0.2)"
          />
        </div>
        <button onClick={handleSend}>
          <IoIosSend className="bg-amber-400 w-10 h-10 rounded-full p-2" />
        </button>
      </div>
    </div>
  );
};
