"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, doc, updateDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { User, Shield, ShieldCheck, Search, Loader2, MoreVertical, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'moderator' | 'student';
  lastLogin?: any;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, newRole: 'admin' | 'moderator' | 'student') => {
    if (!confirm(`Change user role to ${newRole}?`)) return;

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role: newRole,
        roleUpdatedAt: serverTimestamp()
      });

      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role. Permission denied.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400 text-sm">Manage user access levels and identify staff members.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/40">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-white transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <User size={48} className="mx-auto mb-4 opacity-20" />
              <p>No users found in database.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary font-bold">
                          {(u.fullName || "U")[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white">{u.fullName || "New User"}</div>
                          <div className="text-xs text-gray-500 font-mono">{u.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 flex items-center gap-2">
                      <Mail size={14} className="text-gray-600" /> {u.email}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        u.role === 'admin' ? 'bg-primary/20 text-primary border border-primary/20' : 
                        u.role === 'moderator' ? 'bg-secondary/20 text-secondary border border-secondary/20' : 
                        'bg-gray-500/10 text-gray-400 border border-white/5'
                      }`}>
                        {u.role === 'admin' ? <ShieldCheck size={12}/> : 
                         u.role === 'moderator' ? <Shield size={12}/> : 
                         <User size={12}/>}
                        {u.role || 'Student'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <select 
                          value={u.role || 'student'} 
                          onChange={(e) => handleRoleUpdate(u.id, e.target.value as any)}
                          className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-primary outline-none"
                        >
                          <option value="student">Student</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
