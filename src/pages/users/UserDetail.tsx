import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usersApi } from '../../api/users.api';
import type { User } from '../../types';
import {config} from "../../config.ts";
import { useAuthStore } from '../../store/auth.store';
import {Button} from "../../components/ui/Button.tsx";
import {SocioEditModal} from "./UserEditModal.tsx";
import {logger} from "../../utils/logger.ts";

export default function UserDetail() {
    const { id } = useParams()
    const [user, setUser] = useState<User | null>(null)
    const [editOpen, setEditOpen] = useState(false)
    const user_auth = useAuthStore((state) => state.user)
    const canEdit =
        user_auth?.id === user?.id ||
        user_auth?.roles.some((r) => r.id.toString() === config.roleAdmin)

    useEffect(() => {
        if (id) {
            usersApi.getById(+id).then(setUser)
        }
    }, [id])

    if (!user) return <p>Cargando...</p>

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>{user.name} {user.surname}</h1>
            {canEdit && (
                <Button variant="primary" onClick={() => setEditOpen(true)}>
                    Editar perfil
                </Button>
            )}

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                alignItems: 'flex-start',
            }}>
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                    minWidth: '200px',
                }}>
                    <img
                        src={user.profileImage ? `${config.imagesUrl}${user.profileImage}` : '/default-avatar.png'}
                        alt="Foto de perfil"
                        style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid var(--border)',
                        }}
                    />
                    {canEdit && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file && id) {
                                    const result = await usersApi.uploadProfileImage(+id, file)
                                    setUser((prev) => prev ? { ...prev, profileImage: result.profileImage } : prev)
                                }
                            }}
                        />
                    )}
                </div>
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    flex: 1,
                    minWidth: '280px',
                }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email</span>
                        <p style={{ marginTop: '4px' }}>{user.email}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fecha de nacimiento</span>
                        <p style={{ marginTop: '4px' }}>{new Date(user.birthdate).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fecha de alta</span>
                        <p style={{ marginTop: '4px' }}>{new Date(user.registerDate).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Roles</span>
                        <p style={{ marginTop: '4px' }}>{user.roles.length > 0 ? user.roles.map((r) => r.name).join(', ') : 'Sin roles'}</p>
                    </div>
                </div>
            </div>

            <SocioEditModal
                user={user}
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSave={(updated) => setUser((prev) => prev ?
                    { ...updated, roles: prev.roles, profileImage: prev.profileImage} : prev)}
            />
        </div>
    )
}