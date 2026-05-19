import { useContext } from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { ChatContext } from "../../chat/ChatContext";
import { User } from "lucide-react";

export const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers } = useContext(ChatContext);

  const isOnline = onlineUsers?.some(
    (user) => user.userId === recipientUser?.data.Id
  );

  return (
    <div className="flex bg-zinc-800 text-white w-xs p-4 justify-between relative">
      <div className="flex">
        <div className="me-2 flex items-center">
          <User size={48} />
        </div>
        <div>
          <strong>{recipientUser?.data.Username}</strong>
          <p className="text-slate-400">Text message</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-slate-400">10/05/2026</span>
        <div className="rounded-full bg-yellow-900 aspect-square text-center">
          2
        </div>
      </div>
      <span
        className={
          isOnline
            ? `bg-green-500 w-2.5 h-2.5 absolute rounded-full -top-0.5 -right-0.5 }`
            : "absolute"
        }
      ></span>
    </div>
  );
};
