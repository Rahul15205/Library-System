import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { BorrowedBook } from '../types';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle } from 'lucide-react';

const Borrowed: React.FC = () => {
    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchBorrowedBooks();
        }
    }, [user]);

    const fetchBorrowedBooks = async () => {
        if (!user) return;
        try {
            const response = await api.get(`/borrowed-books/user/${user.id}`);
            setBorrowedBooks(response.data);
        } catch (error) {
            console.error('Failed to fetch borrowed books', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (borrowedBookId: string) => {
        if (!user) return;
        try {
            await api.post('/borrowed-books/return', {
                borrowedBookId,
            });
            fetchBorrowedBooks();
            alert('Book returned successfully!');
        } catch (error) {
            console.error('Failed to return book', error);
            alert('Failed to return book');
        }
    };

    if (!user) return <div>Please login to view borrowed books.</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Borrowed Books</h1>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {borrowedBooks.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 bg-white rounded-xl">
                            You haven't borrowed any books yet.
                        </div>
                    ) : (
                        borrowedBooks.map((record) => {
                            const isReturned = !!record.returnedAt;

                            return (
                                <div key={record.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{record.book?.title || 'Unknown Book'}</h3>
                                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Borrowed: {new Date(record.borrowedAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Due: {new Date(record.dueDate).toLocaleDateString()}
                                            </span>
                                            {isReturned && (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Returned: {new Date(record.returnedAt!).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {!isReturned && (
                                        <button
                                            onClick={() => handleReturn(record.id)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Return Book
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default Borrowed;
