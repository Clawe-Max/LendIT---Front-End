import { PackageSearch } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import LoadingSpinner from "../common/LoadingSpinner";
import { LoanCard } from "../Loan/LoanCard";
import { useContext } from "react";
import { UserContext } from "../../user/UserContext";

const LOANS_URL = "/loan/me";

export function MyLoans() {
  const { user } = useContext(UserContext);
  const { data, loading, error, refetch } = useFetch(LOANS_URL);
  const loans = data?.data ?? data ?? [];

  if (loading) return <LoadingSpinner />; 

  if (error) {
    return (
      <p className="text-zinc-400 text-sm text-center py-8">
        Não foi possível carregar os empréstimos.
      </p>
    );
  }

  if (!loans.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-zinc-500">
        <PackageSearch size={40} className="text-zinc-600" />
        <p className="text-sm">Você ainda não tem empréstimos.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl">
      {loans.map((loan) => (
        <LoanCard
          key={loan.id}
          loan={loan}
          user={user}
          refetch={refetch}
        />
      ))}
    </div>
  );
}