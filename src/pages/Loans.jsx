import { DicesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

function Loans() {

    const [myloans, setMyLoans] = useState([]);
    const [loadingLoans, setLoadingLoans] = useState(true);

    useEffect(() => {
        const fetchLoans = async() => {
            try {
                const { data } = await api.get("/loan/me");
            setMyLoans(data.data);
            console.log('data:', myloans);
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoadingLoans(false);
            }
        }
        fetchLoans();
    }, [loadingLoans]);

    if(loadingLoans) return <p>Carregando...</p>

    return (
        <div className="min-h-[calc(100vh-52px)] bg-zinc-900 text-white px-6 py-8 max-w-5xl mx-auto flex flex-col">
      <div className="mb-10">
        {/* <div className="flex items-center gap-2 mb-1">
          <DicesIcon size={20} className="text-yellow-500" />
          <span className="text-yellow-500 text-sm font-medium tracking-widest uppercase">
            Bem-vindo ao LendIT
          </span>
        </div> */}
        <h1 className="text-3xl font-bold text-white leading-tight">
          Gerencie seus empréstimos e quite suas{" "}
          <span className="text-yellow-500">multas.</span>
        </h1>
        {/* <p className="text-zinc-400 mt-2 text-sm max-w-lg">
          Empreste seus jogos! 
          Veja mais pessoas aproveitando sua coleção. 
          Você anuncia, combina o aluguel e
          recebe de volta quando terminarem de jogar.
        </p> */}
      </div>
      <div className="flex flex-col gap-10">
        {/* SEÇÃO MEUS JOGOS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Meus Empréstimos</h2>
          </div>
          <div>
            {myloans.map(loan => (
                <div key={loan.Id}>
                    <p>{loan.Status}</p>
                </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    )
}

export default Loans;