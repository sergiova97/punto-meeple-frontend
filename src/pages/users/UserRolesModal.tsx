import type {Role, User} from "../../types";
import {useEffect, useState} from "react";
import {rolesApi} from "../../api/roles.api.ts";
import {usersApi} from "../../api/users.api.ts";
import {Modal} from "../../components/ui/Modal.tsx";
import {Button} from "../../components/ui/Button.tsx";

interface UserRolesModalProps {
    user: User,
    open: boolean,
    onClose: () => void,
    onSave: (updated: User) => void
}

export function UserRolesModal({ user, open, onClose, onSave }: UserRolesModalProps){
    const [allRoles, setAllRoles] = useState<Role[]>([])
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
        user.roles.map((r) => r.id),
    )
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        rolesApi.getAll().then(setAllRoles)
    }, [])

    function toggleRole(id: number) {
        setSelectedRoleIds((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const updated = await usersApi.assignRoles({
                userId: user.id,
                roleIds: selectedRoleIds,
            })
            onSave({ ...user, roles: updated.roles })
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal open={open} onClose={onClose} title="Asignar roles">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {allRoles.map((role) => (
                        <label
                            key={role.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedRoleIds.includes(role.id)}
                                onChange={() => toggleRole(role.id)}
                            />
                            {role.name}
                        </label>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                    <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}