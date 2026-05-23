import { useEffect, useState } from 'react';
import { gameCategoriesApi } from '../../api/game-categories.api';
import { gameMechanicsApi } from '../../api/game-mechanics.api';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { GameCategory, GameMechanic } from '../../types';

export default function GameSettingsPage() {
    const [categories, setCategories] = useState<GameCategory[]>([])
    const [mechanics, setMechanics] = useState<GameMechanic[]>([])
    const [filterCategory, setFilterCategory] = useState('')
    const [filterMechanic, setFilterMechanic] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalType, setModalType] = useState<'category' | 'mechanic'>('category')
    const [editingItem, setEditingItem] = useState<GameCategory | GameMechanic | null>(null)
    const [itemName, setItemName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function loadCategories() {
        gameCategoriesApi.getAll().then(setCategories)
    }

    function loadMechanics() {
        gameMechanicsApi.getAll().then(setMechanics)
    }

    useEffect(() => {
        loadCategories()
        loadMechanics()
    }, [])

    function openCreate(type: 'category' | 'mechanic') {
        setModalType(type)
        setEditingItem(null)
        setItemName('')
        setError('')
        setModalOpen(true)
    }

    function openEdit(type: 'category' | 'mechanic', item: GameCategory | GameMechanic) {
        setModalType(type)
        setEditingItem(item)
        setItemName(item.name)
        setError('')
        setModalOpen(true)
    }

    async function handleDelete(type: 'category' | 'mechanic', id: number) {
        if (!window.confirm('¿Seguro que quieres eliminar este elemento?')) return
        if (type === 'category') {
            await gameCategoriesApi.remove(id)
            loadCategories()
        } else {
            await gameMechanicsApi.remove(id)
            loadMechanics()
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (modalType === 'category') {
                if (editingItem) {
                    await gameCategoriesApi.update({ id: editingItem.id, name: itemName })
                } else {
                    await gameCategoriesApi.create({ name: itemName })
                }
                loadCategories()
            } else {
                if (editingItem) {
                    await gameMechanicsApi.update({ id: editingItem.id, name: itemName })
                } else {
                    await gameMechanicsApi.create({ name: itemName })
                }
                loadMechanics()
            }
            setModalOpen(false)
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Error al guardar.')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        fontSize: '0.875rem',
        outline: 'none',
    }

    function actionsColumn(type: 'category' | 'mechanic') {
        return {
            label: '',
            render: (item: GameCategory | GameMechanic) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); openEdit(type, item) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: '4px' }}
                    >
                        <FontAwesomeIcon icon={faPencil} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(type, item.id) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', padding: '4px' }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ),
        }
    }

    const categoryColumns = [
        { label: 'Nombre', render: (c: GameCategory) => c.name },
        actionsColumn('category'),
    ]

    const mechanicColumns = [
        { label: 'Nombre', render: (m: GameMechanic) => m.name },
        actionsColumn('mechanic'),
    ]

    const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(filterCategory.toLowerCase()))
    const filteredMechanics = mechanics.filter((m) => m.name.toLowerCase().includes(filterMechanic.toLowerCase()))

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
        }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
                    <input style={inputStyle} placeholder="Buscar categoría..." value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} />
                    <Button variant="primary" onClick={() => openCreate('category')}>Nueva categoría</Button>
                </div>
                <Table columns={categoryColumns} data={filteredCategories} keyExtractor={(c) => c.id} />
            </div>

            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
                    <input style={inputStyle} placeholder="Buscar mecánica..." value={filterMechanic} onChange={(e) => setFilterMechanic(e.target.value)} />
                    <Button variant="primary" onClick={() => openCreate('mechanic')}>Nueva mecánica</Button>
                </div>
                <Table columns={mechanicColumns} data={filteredMechanics} keyExtractor={(m) => m.id} />
            </div>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingItem
                    ? (modalType === 'category' ? 'Editar categoría' : 'Editar mecánica')
                    : (modalType === 'category' ? 'Nueva categoría' : 'Nueva mecánica')
                }
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Nombre</label>
                        <input style={{ ...inputStyle, width: '100%' }} value={itemName} onChange={(e) => setItemName(e.target.value)} required />
                    </div>
                    {error && <p style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>{error}</p>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}