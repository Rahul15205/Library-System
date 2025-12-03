import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Book, Author } from '../types';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Filter, User, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Books: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState<Partial<Book>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [filter, setFilter] = useState({ authorId: '', borrowed: '' });
    const { user } = useAuth();

    useEffect(() => {
        fetchBooks();
        fetchAuthors();
    }, [filter]);

    const fetchBooks = async () => {
        try {
            const params = new URLSearchParams();
            if (filter.authorId) params.append('authorId', filter.authorId);
            if (filter.borrowed) params.append('borrowed', filter.borrowed);

            const response = await api.get(`/books?${params.toString()}`);
            setBooks(response.data);
        } catch (error) {
            console.error('Failed to fetch books', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAuthors = async () => {
        try {
            const response = await api.get('/author');
            setAuthors(response.data);
        } catch (error) {
            console.error('Failed to fetch authors', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await api.delete(`/books/${id}`);
                fetchBooks();
            } catch (error) {
                console.error('Failed to delete book', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentBook.id) {
                await api.patch(`/books/${currentBook.id}`, currentBook);
            } else {
                await api.post('/books', currentBook);
            }
            setIsModalOpen(false);
            fetchBooks();
        } catch (error) {
            console.error('Failed to save book', error);
        }
    };

    const openAddModal = () => {
        setCurrentBook({});
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (book: Book) => {
        setCurrentBook({
            ...book,
            publishedAt: book.publishedAt ? new Date(book.publishedAt).toISOString().split('T')[0] : ''
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleBorrow = async (bookId: string) => {
        if (!user) return;
        try {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);

            await api.post('/borrowed-books/borrow', {
                bookId,
                userId: user.id,
                dueDate: dueDate.toISOString(),
            });
            fetchBooks();
        } catch (error) {
            console.error('Failed to borrow book', error);
            alert('Failed to borrow book');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Library Books</h1>
                    <p className="text-slate-500 mt-1">Manage and browse your book collection</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5" />
                    Add New Book
                </button>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Filter className="w-5 h-5" />
                    <span>Filters:</span>
                </div>
                <div className="flex-1 flex gap-4 w-full sm:w-auto">
                    <select
                        value={filter.authorId}
                        onChange={(e) => setFilter({ ...filter, authorId: e.target.value })}
                        className="input-field py-2"
                    >
                        <option value="">All Authors</option>
                        {authors.map(author => (
                            <option key={author.id} value={author.id}>{author.name}</option>
                        ))}
                    </select>
                    <select
                        value={filter.borrowed}
                        onChange={(e) => setFilter({ ...filter, borrowed: e.target.value })}
                        className="input-field py-2"
                    >
                        <option value="">All Status</option>
                        <option value="false">Available</option>
                        <option value="true">Borrowed</option>
                    </select>
                </div>
            </div>

            {/* Books Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => {
                        const isBorrowed = (book as any).borrowedBooks && (book as any).borrowedBooks.length > 0;

                        return (
                            <div key={book.id} className="card group flex flex-col h-full overflow-hidden">
                                {/* Book Cover Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative p-6 flex items-center justify-center">
                                    <BookOpen className="w-16 h-16 text-white/80" />
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isBorrowed
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {isBorrowed ? 'Borrowed' : 'Available'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-1" title={book.title}>
                                            {book.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <User className="w-4 h-4" />
                                            <span>{book.author?.name}</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                                        {book.description || 'No description available.'}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(book)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {!isBorrowed && (
                                            <button
                                                onClick={() => handleBorrow(book.id)}
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Borrow Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? 'Edit Book' : 'Add New Book'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={currentBook.title || ''}
                            onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
                            <input
                                type="text"
                                value={currentBook.isbn || ''}
                                onChange={(e) => setCurrentBook({ ...currentBook, isbn: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Genre</label>
                            <input
                                type="text"
                                value={currentBook.genre || ''}
                                onChange={(e) => setCurrentBook({ ...currentBook, genre: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                        <select
                            value={currentBook.authorId || ''}
                            onChange={(e) => setCurrentBook({ ...currentBook, authorId: e.target.value })}
                            className="input-field"
                            required
                        >
                            <option value="">Select Author</option>
                            {authors.map(author => (
                                <option key={author.id} value={author.id}>{author.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Published Date</label>
                        <input
                            type="date"
                            value={currentBook.publishedAt ? String(currentBook.publishedAt).split('T')[0] : ''}
                            onChange={(e) => setCurrentBook({ ...currentBook, publishedAt: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={currentBook.description || ''}
                            onChange={(e) => setCurrentBook({ ...currentBook, description: e.target.value })}
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
                            {isEditing ? 'Save Changes' : 'Create Book'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Books;
