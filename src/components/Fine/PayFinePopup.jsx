import { useState } from "react";
import api from "../../api/axios";

function PayFinePopup({ debit }) {

    const PAY_URL = "/fine/pay/";

    const [loading, setLoading] = useState(false);

    async function handlePay() {
        try {
            await api.delete(PAY_URL + debit.id);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-90 h-80 rounded-2xl text-black p-5 flex flex-col items-center gap-1">
            <p className="text-2xl font-bold">Multa</p>
            <p className="text-xs text-slate-400">ID do empréstimo: {debit.loanId}</p>
            <p className="text-xl">Jogo: {debit.gameName}</p>
            <p className="my-3 text-6xl font-black">R${debit.value.toFixed(2)}</p>
            <p className="font-light text-sm self-start text-slate-500">Data de início: {new Date(debit.startDate).toLocaleDateString("pt-BR")}</p>
            <p className="font-light text-sm self-start text-slate-500">Data de vencimento: {new Date(debit.deadline).toLocaleDateString("pt-BR")}</p>
            <button className={`py-2 px-7 rounded-xl text-white transition-all delay-30 ${loading ? 'bg-red-950 cursor-progress' : 'cursor-pointer hover:bg-red-600 bg-red-500'} mt-4`} onClick={() => {
                handlePay();
                setLoading(true);
                setTimeout(() => {
                    window.location.reload(true);
                }, 2000)
            }}>{loading ? 'Aguarde...' : 'Pagar'}</button>
        </div>
    )
}

export default PayFinePopup;