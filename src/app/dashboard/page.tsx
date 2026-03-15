"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle, Clock, Award, BookOpen, Settings, Share2, Cpu, Mail, AlertCircle, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (user?.uid) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            
            // Fetch real course details for each enrolled ID
            if (data.enrolledCourses && data.enrolledCourses.length > 0) {
              setLoadingCourses(true);
              const coursePromises = data.enrolledCourses.map(async (courseId: string) => {
                const cDoc = await getDoc(doc(db, "courses", courseId));
                if (cDoc.exists()) {
                  return { id: cDoc.id, ...cDoc.data(), progress: 0 }; // Progress can be made dynamic later
                }
                return null;
              });
              const courses = (await Promise.all(coursePromises)).filter(c => c !== null);
              setEnrolledCourses(courses);
              setLoadingCourses(false);
            }
          }
        } catch (error) {
          console.error("Error fetching user data/courses:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchUserData();
  }, [user]);

  const purchasedCourses = enrolledCourses;

  return (
    <ProtectedRoute>
    <div className="w-full flex justify-center pb-32 relative overflow-hidden">
      {/* Dashboard Global Network Watermark */}
      <div className="absolute top-20 right-0 translate-x-1/2 text-primary/5 pointer-events-none -z-10">
         <Share2 size={800} strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full relative z-10">
        
        {user && !user.emailVerified && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Please verify your email</p>
                <p className="text-gray-400 text-xs">A verification link was sent to {user.email}. Check your inbox and spam folder.</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-black text-xs font-bold rounded-lg hover:bg-white transition-colors"
            >
              I've Verified
            </button>
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {userData ? (userData.firstName || userData.fullName?.split(' ')[0]) : (loading ? "..." : "Student")}!
            </h1>
            <p className="text-gray-400">
              {purchasedCourses.length > 0 
                ? "Pick up where you left off and finish your courses." 
                : "Explore our courses to start your learning journey."}
            </p>
          </div>
          <Link href="/settings" className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Settings size={18} />
            <span className="text-sm font-medium">Account Settings</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-xl text-primary"><BookOpen size={24} /></div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Enrolled Courses</p>
              <h2 className="text-3xl font-bold text-white">{purchasedCourses.length}</h2>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="p-4 bg-green-500/10 rounded-xl text-green-500"><Award size={24} /></div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Completed</p>
              <h2 className="text-3xl font-bold text-white">0</h2>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500"><Clock size={24} /></div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Learning Hours</p>
              <h2 className="text-3xl font-bold text-white">0h</h2>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">My Courses</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loadingCourses ? (
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="animate-spin text-primary" size={40} />
               <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase">Fetching Course Records...</p>
            </div>
          ) : purchasedCourses.length > 0 ? (
            purchasedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-6 relative overflow-hidden group hover:border-primary/30 transition-all"
              >
                <div className="w-full sm:w-40 h-40 bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden border border-white/5 shrink-0">
                  <img src={course.image || "https://www.transparenttextures.com/patterns/cubes.png"} alt={course.title} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <PlayCircle size={48} className="text-white/20 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors truncate">{course.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {course.duration || "10 Hours"}</span>
                    <span className="flex items-center gap-1.5"><BookOpen size={14} /> {course.category || "Robotics"}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                      <span className="text-gray-500">Mastery Progress</span>
                      <span className="text-primary">{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-primary shadow-[0_0_10px_rgba(255,87,34,0.3)]" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                </div>
                <Link 
                  href={`/learn/${course.id}`}
                  className="absolute inset-0 z-10"
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-2 glass-card p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="p-6 bg-white/5 rounded-full text-gray-400 mb-2">
                <BookOpen size={48} strokeWidth={1} />
              </div>
              <h3 className="text-xl font-bold text-white">No active courses</h3>
              <p className="text-gray-400 max-w-sm">You haven't enrolled in any courses yet. Start your journey by exploring our available programs.</p>
              <Link href="/courses" className="mt-4 px-8 py-3 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(60,179,150,0.2)]">
                Browse Courses
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
