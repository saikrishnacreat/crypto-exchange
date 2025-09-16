'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string | null;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const router = useRouter();

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3001/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.status === 403) {
        router.replace('/dashboard');
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [router]);

  const handleEditClick = (user: User) => {
    setEditingUser({ ...user }); // Create a copy to edit
    setIsModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const token = localStorage.getItem('token');
    await fetch(`http://localhost:3001/api/admin/users/${editingUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editingUser.name,
        email: editingUser.email,
        isAdmin: editingUser.isAdmin,
      }),
    });
    
    setIsModalOpen(false);
    fetchUsers(); // Refresh the user list
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser) return;
    const { name, value, type, checked } = e.target;
    setEditingUser({
      ...editingUser,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Admin Panel - All Users</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4">{user.id}</td>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.isAdmin ? 'Yes' : 'No'}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleEditClick(user)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User: {editingUser.name}</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input type="text" name="name" value={editingUser.name || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" name="email" value={editingUser.email} onChange={handleInputChange} className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="isAdmin" checked={editingUser.isAdmin} onChange={handleInputChange} className="h-4 w-4 rounded" />
                <label className="ml-2 block text-sm">Is Admin?</label>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}