import { useFetchRecipientUser } from "../../hooks/useFetchRecipient"

export const UserChat = ({chat, user}) => {

    const {recipientUser} = useFetchRecipientUser(chat, user)

    return (
        <div className="flex bg-slate-900 text-white w-xs p-4 justify-between relative">
            <div className="flex">
                <div className="me-2"><img src="src/assets/user-default.svg" alt="" width={'50px'} /></div>
                <div>
                    <strong>{recipientUser?.data.Username}</strong>
                    <p className="text-slate-400">Text message</p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-slate-400">10/05/2026</span>
                <div className="rounded-full bg-cyan-500 aspect-square text-center">2</div>
                {/* <span className="bg-green-500 w-2.5 h-2.5 absolute rounded-full -top-0.5 -right-0.5"></span> */}
            </div>
        </div>
    )
}