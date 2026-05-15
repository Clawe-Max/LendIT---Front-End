import { useContext } from "react"
import { ChatContext } from "../../chat/ChatContext"
import { UserContext } from "../../user/UserContext"

export const PotentialChats = () => {
    const {user} = useContext(UserContext)
    const {potentialChats, createChat, onlineUsers} = useContext(ChatContext)
    return <>
        <div className="flex gap-1">
            {potentialChats && potentialChats.map((u, index) => (
                <div className="bg-cyan-500 w-fit p-1.5 rounded border-none cursor-pointer text-white relative" key={index}
                    onClick={() => createChat(user.data.Id, u.id)}
                >
                    {u.username}
                    <span className={onlineUsers?.some((user) => user.userId === u?.id) ? `bg-green-500 w-2.5 h-2.5 absolute rounded-full -top-0.5 -right-0.5}` : ''}></span>
                </div>
            ))}
        </div>
    </>
}