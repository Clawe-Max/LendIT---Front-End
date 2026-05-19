import { useContext } from "react";
import { ChatContext } from "../../chat/ChatContext";
import { UserContext } from "../../user/UserContext";

export const PotentialChats = () => {
  const { user } = useContext(UserContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
  console.log(potentialChats);
  return (
    <>
      <div className="flex gap-1 mb-2">
        {potentialChats &&
          potentialChats.map((u) => (
            <div
              className="bg-yellow-900 w-fit min-w-32 text-center p-2 rounded border-none cursor-pointer text-white relative"
              key={u.id}
              onClick={() => createChat(user.data.Id, u.id)}
            >
              {u.username}
              <span
                className={
                  onlineUsers?.some((user) => user.userId === u?.id)
                    ? `bg-green-500 w-2.5 h-2.5 absolute rounded-full -top-0.5 -right-0.5}`
                    : "absolute"
                }
              ></span>
            </div>
          ))}
      </div>
    </>
  );
};
