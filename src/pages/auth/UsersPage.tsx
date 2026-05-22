import { useEffect, useState } from 'react';
import { usersApi } from '../../api/users.api';
import { Table } from "../../components/ui/Table.tsx";
import type { User } from '../../types';
import {Pagination} from "../../components/ui/Pagination.tsx";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "../../store/auth.store.ts";
import {config} from "../../config.ts";
import {Button} from "../../components/ui/Button.tsx";
import {UserCreateModal} from "../users/UserCreateModal.tsx";

const columns = [
    { label: 'Nombre', render: (user: User) => `${user.name} ${user.surname}` },
    { label: 'Email', render: (user: User) => user.email },
    { label: 'Fecha de nacimiento', render: (user: User) => user.birthdate },
]

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [createOpen, setCreateOpen] = useState(false)
    const limit = 10
    const navigate = useNavigate()
    const user_auth = useAuthStore((state) => state.user)

    const canCreate = user_auth?.roles.some((r) => r.id.toString() === config.roleAdmin)

    function loadUsers() {
        usersApi.getAll(page, limit).then((res) => {
            setUsers(res.data)
            setTotal(res.total)
        })
    }
    useEffect(() => {
        loadUsers()
    }, [page])

    const totalPages = Math.ceil(total / limit)
console.log(user_auth)
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h1>Socios</h1>
                {canCreate && (
                    <Button variant="primary" onClick={() => setCreateOpen(true)}>
                        Nuevo socio
                    </Button>
                )}
            </div>
            <Table
                columns={columns}
                data={users}
                keyExtractor={(user) => user.id}
                onRowClick={(user) => navigate(`/users/${user.id}`)}
            />
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            <UserCreateModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSave={loadUsers}
            />
        </div>
    )
}