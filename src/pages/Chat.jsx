import { useContext } from "react";
import { ChatContext } from "../chat/ChatContext";
import { UserContext } from "../user/UserContext";
import { UserChat } from "../components/chat/UserChat";
import { PotentialChats } from "../components/chat/PotentialChats";
import { ChatBox } from "../components/chat/ChatBox";

export const Chat = () => {
    const {user} = useContext(UserContext)
    const {
        userChats,
        isUserChatsLoading,
        updateCurrentChat
    } = useContext(ChatContext);

    return (
        <div>
            <PotentialChats/ >
            <div className="mt-2">{userChats?.length < 1 ? null :
                <div className="flex gap-3">
                    <div>
                        {isUserChatsLoading && <p>Carregando chats...</p>}
                        {userChats?.map((chat,index) => {
                            return (
                                <div key={index} className="mb-1" onClick={() => updateCurrentChat(chat)}>
                                    <UserChat chat={chat} user={user}></UserChat>
                                </div>
                            )
                        })}
                    </div>
                    <ChatBox />
                </div>
            }</div>
        </div>
    )
}