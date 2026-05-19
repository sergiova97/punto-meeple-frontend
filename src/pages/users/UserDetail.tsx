import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usersApi } from '../../api/users.api';
import type { User } from '../../types';
import {config} from "../../config.ts";

export default function UserDetail() {
    const { id } = useParams()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (id) {
            usersApi.getById(+id).then(setUser)
        }
    }, [id])

    if (!user) return <p>Cargando...</p>

    return (
        <div>
            <h1>{user.name} {user.surname}</h1>

            <div style={{ marginTop: '16px' }}>
                <img
                    src={user.profileImage ? `${config.imagesUrl}${user.profileImage}` : '/default-avatar.png'}
                    alt="Foto de perfil"
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ marginTop: '8px' }}>
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
                </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email</span>
                    <p>{user.email}</p>
                </div>
                <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fecha de nacimiento</span>
                    <p>{user.birthdate}</p>
                </div>
                <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fecha de alta</span>
                    <p>{new Date(user.registerDate).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Roles</span>
                    <p>{user.roles.length > 0 ? user.roles.map((r) => r.name).join(', ') : 'Sin roles'}</p>
                </div>
            </div>
        </div>
    )
}