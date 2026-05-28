import {Modal} from "../ui/Modal.tsx";
import {useEffect, useState} from "react";
import type {User} from "../../types";
import {usersApi} from "../../api/users.api.ts";
import {membershipFeesApi} from "../../api/membership-fees.api.ts";
import {Button} from "../ui/Button.tsx";

interface GenerateFeesModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function getAllMonths(): string[] {
    const year = new Date().getFullYear()
    return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`)
}

export function GenerateFeesModal({ open, onClose, onSuccess }: GenerateFeesModalProps) {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
    const [price, setPrice] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const allMonths = getAllMonths()

    useEffect(() => {
        if (open) {
            usersApi.getAll(1, 10, true).then((res) => setUsers(res.data))
            setSelectedPeriods([])
            setSelectedUserIds([])
            setPrice('')
            setError('')
        }
    }, [open])

    function toggleUser(id: number) {
        setSelectedUserIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        )
    }

    function toggleAll() {
        if (selectedUserIds.length === users.length) {
            setSelectedUserIds([])
        } else {
            setSelectedUserIds(users.map((u) => u.id))
        }
    }

    function togglePeriod(period: string) {
        setSelectedPeriods((prev) =>
            prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period],
        )
    }

    function toggleAllPeriods() {
        if (selectedPeriods.length === allMonths.length) {
            setSelectedPeriods([])
        } else {
            setSelectedPeriods(allMonths)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (selectedUserIds.length === 0) {
            setError('Selecciona al menos un socio.')
            return
        }

        if (selectedPeriods.length === 0) {
            setError('Selecciona al menos un mes.')
            return
        }

        setLoading(true)

        try {
            await membershipFeesApi.generateFees({
                userIds: selectedUserIds,
                periods: selectedPeriods,
                price: +price,
            })
            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Error al generar las cuotas.')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        fontSize: '0.9rem',
        outline: 'none',
    }

    const allSelected = selectedUserIds.length === users.length
    const allPeriodsSelected = selectedPeriods.length === allMonths.length

    return (
        <Modal open={open} onClose={onClose} title="Generar cuotas" width={520}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                        Precio por cuota (€)
                    </label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Ej: 10.00"
                        required
                    />
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Meses ({selectedPeriods.length}/{allMonths.length} seleccionados)
                        </label>
                        <button
                            type="button"
                            onClick={toggleAllPeriods}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}
                        >
                            {allPeriodsSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                        </button>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '4px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '8px',
                    }}>
                        {allMonths.map((period, index) => (
                            <label
                                key={period}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 8px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedPeriods.includes(period)}
                                    onChange={() => togglePeriod(period)}
                                />
                                {MONTH_NAMES[index]}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Socios ({selectedUserIds.length}/{users.length} seleccionados)
                        </label>
                        <button
                            type="button"
                            onClick={toggleAll}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}
                        >
                            {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                        </button>
                    </div>
                    <div style={{
                        maxHeight: '200px',
                        overflowY: 'auto',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '4px',
                    }}>
                        {users.map((user) => (
                            <label
                                key={user.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedUserIds.includes(user.id)}
                                    onChange={() => toggleUser(user.id)}
                                />
                                {user.surname}, {user.name}
                            </label>
                        ))}
                    </div>
                </div>

                {error && <p style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                    <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Generando...' : 'Generar cuotas'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}