import { useContext, useState } from "react";
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

  if (!recipientUser)
    return (
      <p className="w-full text-center text-white">
        No conversation selected yet...
      </p>
    );

  if (isMessagesLoading)
    return <p className="w-full text-center">Loading chat...</p>;

  return (
    <div className="h-full flex flex-col gap-4 bg-zinc-900 flex-1 rounded-lg">
      <div className="bg-zinc-700 w-full text-white text-center p-2 rounded-t-sm">
        <strong>{recipientUser.data.Username}</strong>
      </div>
      <div className="flex flex-col flex-1 gap-3 p-2 overflow-y-auto">
        {messages &&
          messages.map((message) => (
            <div
              className={
                " w-50 flex-col p-2 mb-2" +
                ` ${message?.senderId === user.data.Id ? "bg-amber-300 self-end rounded-t-xl rounded-l-xl" : "bg-cyan-400 rounded-t-xl rounded-r-xl"}`
              }
              key={message.id}
            >
              <div>{message?.text}</div>
              <span className="text-xs">
                {moment(message.createdAt).calendar()}
              </span>
            </div>
          ))}
      </div>
      <div className="flex gap-3 w-full grow-0 self-end align pb-2 pr-3">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="munito"
          borderColor="rgba(72,112,223,0.2)"
        />
        <button
          onClick={() =>
            sendTextMessage(
              textMessage,
              user.data,
              currentChat.id,
              setTextMessage
            )
          }
        >
          <IoIosSend className="bg-amber-400 w-10 h-10 rounded-full p-2" />
        </button>
      </div>
    </div>
  );
};
