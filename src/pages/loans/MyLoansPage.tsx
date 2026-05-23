import {useAuthStore} from "../../store/auth.store.ts";
import {LoansTable} from "../../components/loans/LoansTable.tsx";

export default function MyLoansPage() {
    const authUser = useAuthStore((state) => state.user)
    return <LoansTable userId={authUser?.id} showUserColumn={false} />
}