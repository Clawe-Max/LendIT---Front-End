import { useCallback, useContext, useEffect, useState } from "react";
import api from "@/api/axios";
import { ChatContext } from "./ChatContext";
import { UserContext } from "../user/UserContext";

export const ChatContextProvider = ({children}) => {

    const { user } = useContext(UserContext);
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)

    useEffect(() => {

        const getUsers = async() => {
            const response = await api.get('/user')

            if(response.error)
                return console.log("Error fetching users", response)

            const pChats = response.data.data.filter((u) => {
                let isChatCreated = false

                if(user?.data.Id === u.id) return false

                if(userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.user1Id === u.id || chat.user2Id === u.id
                    })
                }
                return !isChatCreated
            })

            setPotentialChats(pChats)
        }

        getUsers()
    }, [userChats])

    useEffect(() => {
        const getUserChats = async () => {
            if(user?.data?.Id) {

                setIsUserChatsLoading(true)
                setUserChatsError(null)

                const response = await api.get(`/chat/${user?.data?.Id}`)
                
                setIsUserChatsLoading(false)

                if(response?.error) {
                    return setUserChatsError(response)
                }

                setUserChats(response?.data)
            }
        }

        getUserChats()
    }, [user])

    useEffect(() => {
        const getMessages = async () => {
                setIsMessagesLoading(true)
                setMessagesError(null)

                const response = await api.get(`/messages/${currentChat?.id}`)
                
                setIsMessagesLoading(false)

                if(response?.error) {
                    return setMessagesError(response)
                }

                setMessages(response?.data)
        }

        getMessages()
    }, [currentChat])    

    const sendTextMessage = useCallback(async(textMessage, sender, currentChatId, setTextMessage) => {
        
        if (!textMessage) return console.log("You must type something...")

        const response = await api.post(`/messages`, {
            chatId: currentChatId,
            senderId: sender.Id,
            text: textMessage
        })

        if(response?.error) 
            return setSendTextMessageError(response)

        setNewMessage(response?.data)
        setMessages((prev) => [...prev, response.data])
        setTextMessage("")
    }, [])

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    }, [])

    const createChat = useCallback(async(firstId, secondId) => {
        const response = await api.post('/chat/', {
            firstId, 
            secondId
        })
        if(response.error) return console.log("Error creating chat", response)
        
        setUserChats((prev) => [...prev, response])
    }, [])

    return <ChatContext.Provider value={{
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
        sendTextMessage
    }}>
        {children}
    </ChatContext.Provider>
}