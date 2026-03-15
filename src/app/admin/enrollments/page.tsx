"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, doc, updateDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { CheckCircle, XCircle, Clock, Search, ExternalLink, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Enrollment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  amount: string;
  paymentMethod: string;
  senderNumber: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: any;
}

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState("");

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "enrollments"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];
      setEnrollments(data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected', userId: string, courseId: string) => {
    if (!confirm(`Are you sure you want to ${newStatus} this enrollment?`)) return;

    try {
      const { arrayUnion } = await import("firebase/firestore");
      const enrollmentRef = doc(db, "enrollments", id);
      await updateDoc(enrollmentRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // If approved, update the user's document to give them access to the course
      if (newStatus === 'approved') {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          enrolledCourses: arrayUnion(courseId)
        });
      }

      setEnrollments(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));

    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const filteredEnrollments = enrollments.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.userName.toLowerCase().includes(search.toLowerCase()) || 
                          item.transactionId.toLowerCase().includes(search.toLowerCase()) ||
                          item.senderNumber.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enrollment Requests</h1>
          <p className="text-gray-400 text-sm">Review and approve course access based on payment verification.</p>
        </div>

        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === s ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, TxID, or number..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-white transition-colors"
            />
          </div>
          <div className="text-xs text-gray-500">
            Showing {filteredEnrollments.length} items
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Clock size={48} className="mx-auto mb-4 opacity-20" />
              <p>No enrollment requests found matching your criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">Student</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Sender Number</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence mode="popLayout">
                  {filteredEnrollments.map((item) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={item.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-bold text-white">{item.userName}</div>
                        <div className="text-xs text-gray-500 font-mono">{item.userId.substring(0, 8)}...</div>
                      </td>
                      <td className="p-4 text-gray-300 font-medium">{item.courseTitle}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.paymentMethod === 'bkash' ? 'bg-pink-500/10 text-pink-500' : 'bg-orange-500/10 text-orange-400'
                        }`}>
                          {item.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-gray-400">{item.senderNumber}</td>
                      <td className="p-4">
                        <span className="font-mono text-primary font-bold">{item.transactionId}</span>
                      </td>
                      <td className="p-4 font-bold text-white">{item.amount}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'approved' ? 'bg-green-500/10 text-green-400' : 
                          item.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 
                          'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {item.status === 'approved' ? <CheckCircle size={12}/> : 
                           item.status === 'rejected' ? <XCircle size={12}/> : 
                           <Clock size={12}/>}
                          <span className="capitalize">{item.status}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {item.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(item.id, 'approved', item.userId, item.courseId)}
                              className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(item.id, 'rejected', item.userId, item.courseId)}
                              className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        )}
                        {item.status !== 'pending' && (
                           <div className="text-xs text-gray-600 font-medium uppercase italic">Processed</div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
