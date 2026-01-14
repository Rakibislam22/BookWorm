'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiBook, FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MyLibraryPage() {
  const [shelves, setShelves] = useState({
    wantToRead: [],
    currentlyReading: [],
    read: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wantToRead');

  useEffect(() => {
    fetchShelves();
  }, []);

  const fetchShelves = async () => {
    try {
      const res = await fetch('/api/users/shelf');
      const data = await res.json();
      if (data.success) {
        setShelves(data.shelves);
      }
    } catch {
      toast.error('Failed to load library');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (bookId, progress) => {
    try {
      const res = await fetch('/api/users/shelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          shelf: 'currentlyReading',
          progress,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShelves(data.shelves);
        toast.success('Progress updated');
      }
    } catch {
      toast.error('Failed to update progress');
    }
  };

  const tabs = [
    { id: 'wantToRead', label: 'Want to Read', icon: FiBook, count: shelves.wantToRead.length },
    { id: 'currentlyReading', label: 'Currently Reading', icon: FiBookOpen, count: shelves.currentlyReading.length },
    { id: 'read', label: 'Read', icon: FiCheckCircle, count: shelves.read.length },
  ];

  const currentBooks = shelves[activeTab] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8  min-h-screen">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">My Library</h1>

      {/* Tabs */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg mb-6">
        <div className="flex border-b border-gray-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition ${activeTab === tab.id
                    ? 'bg-gray-800 text-amber-400 border-b-2 border-amber-500'
                    : 'text-gray-400 hover:bg-gray-800'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon />
                  <span>{tab.label}</span>
                  <span className="bg-gray-800 text-amber-400 text-xs px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Books */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[2/3] bg-gray-700"></div>
            </div>
          ))}
        </div>
      ) : currentBooks.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">
            {activeTab === 'wantToRead' && "You haven't added any books yet."}
            {activeTab === 'currentlyReading' && "You're not currently reading any books."}
            {activeTab === 'read' && "You haven't marked any books as read yet."}
          </p>
          <Link
            href="/browse"
            className="inline-block px-4 py-2 bg-amber-500 text-black rounded-md hover:bg-amber-400 transition"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {currentBooks.map((item) => {
            const book = item.book || item;
            const progress = item.progress || 0;
            const totalPages = item.totalPages || book.totalPages;

            return (
              <div
                key={book._id}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group"
              >
                <Link href={`/books/${book._id}`}>
                  <div className="aspect-[2/3] relative bg-gray-800">
                    {book.coverImage ? (
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FiBook className="h-12 w-12 text-gray-600" />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-3">
                  <Link href={`/books/${book._id}`}>
                    <h3 className="font-semibold text-sm text-gray-100 line-clamp-2 mb-1 hover:text-amber-400">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">{book.author}</p>
                  </Link>

                  {activeTab === 'currentlyReading' && totalPages > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((progress / totalPages) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((progress / totalPages) * 100, 100)}%` }}
                        />
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={totalPages}
                        value={progress}
                        onChange={(e) =>
                          updateProgress(book._id, parseInt(e.target.value || 0))
                        }
                        className="mt-2 w-full px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Pages read"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
