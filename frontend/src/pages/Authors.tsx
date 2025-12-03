import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Author } from '../types';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Calendar, MapPin } from 'lucide-react';

const Authors: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAuthor, setCurrentAuthor] = useState<Partial<Author>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await api.get('/author');
            setAuthors(response.data);
        } catch (error) {
            console.error('Failed to fetch authors', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this author?')) {
            try {
                await api.delete(`/author/${id}`);
                fetchAuthors();
            } catch (error: any) {
                console.error('Failed to delete author', error);
                const message = error.response?.data?.message || 'Failed to delete author';
                alert(message);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentAuthor.id) {
                await api.patch(`/author/${currentAuthor.id}`, currentAuthor);
            } else {
                await api.post('/author', currentAuthor);
            }
            setIsModalOpen(false);
            fetchAuthors();
        } catch (error) {
            console.error('Failed to save author', error);
        }
    };

    const openAddModal = () => {
        setCurrentAuthor({});
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (author: Author) => {
        setCurrentAuthor({
            ...author,
            birthDate: author.birthDate ? new Date(author.birthDate).toISOString().split('T')[0] : ''
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Authors</h1>
                    <p className="text-slate-500 mt-1">Manage the creative minds behind the books</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5" />
                    Add New Author
                </button>
            </div>

            {/* Authors Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {authors.map((author) => (
                        <div key={author.id} className="card group flex flex-col h-full overflow-hidden">
                            {/* Author Cover Placeholder */}
                            <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 relative p-6 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center text-2xl font-bold text-indigo-600 border-4 border-white">
                                    {author.name.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{author.name}</h3>
                                    {author.nationality && (
                                        <div className="flex items-center justify-center gap-1.5 text-sm text-slate-500">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{author.nationality}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 mb-6 flex-1">
                                    {author.birthDate && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>Born: {new Date(author.birthDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {author.biography && (
                                        <p className="text-sm text-slate-600 line-clamp-3 italic">
                                            "{author.biography}"
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-auto">
                                    <button
                                        onClick={() => openEditModal(author)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(author.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? 'Edit Author' : 'Add New Author'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={currentAuthor.name || ''}
                            onChange={(e) => setCurrentAuthor({ ...currentAuthor, name: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nationality</label>
                        <input
                            type="text"
                            value={currentAuthor.nationality || ''}
                            onChange={(e) => setCurrentAuthor({ ...currentAuthor, nationality: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Birth Date</label>
                        <input
                            type="date"
                            value={currentAuthor.birthDate ? String(currentAuthor.birthDate).split('T')[0] : ''}
                            onChange={(e) => setCurrentAuthor({ ...currentAuthor, birthDate: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Biography</label>
                        <textarea
                            value={currentAuthor.biography || ''}
                            onChange={(e) => setCurrentAuthor({ ...currentAuthor, biography: e.target.value })}
                            className="input-field min-h-[100px]"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            {isEditing ? 'Save Changes' : 'Create Author'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Authors;
