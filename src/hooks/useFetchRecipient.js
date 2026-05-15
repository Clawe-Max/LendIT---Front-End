import { useEffect, useState } from "react";
import api from "@/api/axios";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null)
    const [error, setError] = useState(null)

    const recipientId = chat?.user1Id !== user?.data.Id ? chat?.user1Id: chat?.user2Id

    useEffect(() => {
        
        const getUser = async() => {
            
            if(!recipientId) return null

            const response = await api.get(`/user/${recipientId}`)

            if(response.error)
                return setError(response)
            
            setRecipientUser(response.data)
        }

        getUser()
    }, [recipientId])

    return {recipientUser, error}
}