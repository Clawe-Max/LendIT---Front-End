import { useContext } from "react";
import { ChatContext } from "../chat/ChatContext";
import { UserContext } from "../user/UserContext";
import { UserChat } from "../components/chat/UserChat";
import { PotentialChats } from "../components/chat/PotentialChats";
import { ChatBox } from "../components/chat/ChatBox";

export const Chat = () => {
  const { user } = useContext(UserContext);
  const { userChats, isUserChatsLoading, updateCurrentChat } =
    useContext(ChatContext);
  return (
    <div className="h-[calc(100dvh-56px)] flex flex-col overflow-hidden p-4">
      <PotentialChats />
      <div className=" flex-1 min-h-0">
        {userChats?.length < 1 ? null : (
          <div className="flex gap-3 h-full min-h-0">
            <div className="overflow-y-auto shrink-0 w-87.5">
              {isUserChatsLoading && <p>Carregando chats...</p>}
              {userChats?.map((chat) => {
                return (
                  <div key={chat.id} onClick={() => updateCurrentChat(chat)}>
                    <UserChat chat={chat} user={user}></UserChat>
                  </div>
                );
              })}
            </div>
            <ChatBox />
          </div>
        )}
      </div>
    </div>
  );
};
