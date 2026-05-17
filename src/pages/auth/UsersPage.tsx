import { useEffect, useState } from 'react'
import { usersApi } from '../../api/users.api'
import { Table } from "../../components/ui/Table.tsx";
import type { User } from '../../types'
import {Pagination} from "../../components/ui/Pagination.tsx";

const columns = [
    { label: 'Nombre', render: (user: User) => `${user.name} ${user.surname}` },
    { label: 'Email', render: (user: User) => user.email },
    { label: 'Fecha de nacimiento', render: (user: User) => user.birthdate },
]

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const limit = 1

    useEffect(() => {
        usersApi.getAll(page, limit).then((res) => {
            setUsers(res.data)
            setTotal(res.total)
        })
    }, [page])

    const totalPages = Math.ceil(total / limit)

    return (
        <div>
            <h1>Socios</h1>

            <Table
                columns={columns}
                data={users}
                keyExtractor={(user) => user.id}
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    )
}