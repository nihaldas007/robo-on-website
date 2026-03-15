"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PlayCircle, Star, Clock, BookOpen, CheckCircle, Share2, Award, FileText, Loader2, X, Copy, Check, Shield, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, getDoc, doc } from "firebase/firestore";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  coursePrice: string;
  courseId: string;
}

function EnrollmentModal({ isOpen, onClose, courseTitle, coursePrice, courseId }: EnrollmentModalProps) {
  const { user, userData } = useAuth();
  const [method, setMethod] = useState<'bkash' | 'nogod'>('bkash');
  const [phone, setPhone] = useState("");
  const [txId, setTxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please sign in to enroll");
    setLoading(true);

    try {
      await addDoc(collection(db, "enrollments"), {
        userId: user.uid,
        userName: userData?.fullName || user.displayName || "Anonymous",
        userEmail: user.email,
        courseId,
        courseTitle,
        amount: coursePrice,
        paymentMethod: method,
        senderNumber: phone,
        transactionId: txId,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(onClose, 3000);
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("Failed to submit enrollment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-6 sm:p-8 rounded-[32px] border border-white/10 relative my-auto shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 pointer-events-none transform-gpu" style={{ background: 'radial-gradient(circle, rgba(60,179,150,0.1) 0%, rgba(60,179,150,0) 70%)' }} />
        
        {success ? (
          <div className="text-center py-10">
            <CheckCircle size={56} className="text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Request Submitted!</h2>
            <p className="text-sm text-gray-400">Admin will verify your payment and grant access within 1-2 hours.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">Course Enrollment</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate max-w-[200px] sm:max-w-[280px]">{courseTitle}</p>
              </div>
              <button type="button" onClick={onClose} className="p-2 -mr-2 -mt-2 text-gray-500 hover:text-white transition-colors relative z-10">✕</button>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 sm:p-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 text-xs sm:text-sm">Payable Amount:</span>
                <span className="text-lg sm:text-xl font-bold text-white">{coursePrice}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setMethod('bkash')}
                    className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${method === 'bkash' ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    <span className="font-bold text-white text-sm">bKash</span>
                    <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase">Personal</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setMethod('nogod')}
                    className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${method === 'nogod' ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    <span className="font-bold text-white text-sm">Nagad</span>
                    <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase">Personal</span>
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-gray-400 space-y-1 sm:space-y-1.5 focus-within:border-white/10 transition-colors">
                <p>1. Go to your {method === 'bkash' ? 'bKash' : 'Nagad'} App</p>
                <p className="flex justify-between items-center">
                  <span>2. Send Money to: <span className="text-white font-bold font-mono ml-1">01752163816</span></span>
                </p>
                <p>3. Enter Amount: <span className="text-white font-bold ml-1">{coursePrice}</span></p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Your {method === 'bkash' ? 'bKash' : 'Nagad'} Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white outline-none focus:border-primary transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Transaction ID (TxID)</label>
                  <input 
                    type="text" 
                    required 
                    value={txId}
                    onChange={e => setTxId(e.target.value)}
                    placeholder="A1B2C3D4E5" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white outline-none focus:border-primary transition-colors uppercase" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-black font-bold py-3.5 sm:py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(60,179,150,0.3)] disabled:opacity-50 mt-2"
              >
                {loading ? "Verifying..." : "Confirm Enrollment"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  order: number;
}

export default function CourseDetails() {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  
  const title = (params.id as string)?.replace("-", " ") || "Course Details";
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch Course Data
        const courseDoc = await getDoc(doc(db, "courses", params.id as string));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() });
        }

        // Fetch Lessons for Syllabus
        const lessonsRef = collection(db, "courses", params.id as string, "lessons");
        const q = query(lessonsRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const lessonsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lesson[];
        setLessons(lessonsData);
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  const price = course?.price || "৳2,000";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-gray-500">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-32">
      <EnrollmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseTitle={course?.title || title}
        coursePrice={price}
        courseId={params.id as string}
      />
      {/* Course Hero Header */}
      <div className="relative border-b border-white/10 bg-black/60 pt-16 pb-12">
        <div className="absolute inset-0 pointer-events-none transform-gpu" style={{ background: 'radial-gradient(ellipse at top, rgba(60,179,150,0.08) 0%, rgba(60,179,150,0) 70%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 relative z-10">
          
          <div className="lg:w-2/3">
            <div className="flex gap-2 mb-6">
              <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">Intermediate</span>
              <span className="glass text-white text-xs font-semibold px-3 py-1 rounded-full">{course?.category || "IoT"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 capitalize">{course?.title || title}</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Master the principles of {course?.category || "technology"} from sensor integration to edge computing and cloud analytics. Build real-world connected devices using industry protocols.
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-8">
              <div className="flex items-center gap-2"><div className="flex text-yellow-500"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor" stroke="currentColor"/></div><span className="font-medium text-white">4.9</span> (1.2k ratings)</div>
              <div className="flex items-center gap-2"><Clock size={16} className="text-primary"/> {lessons.length > 0 ? `${lessons.length * 10} min video` : "15 Hours of Video"}</div>
              <div className="flex items-center gap-2"><BookOpen size={16} className="text-primary"/> {lessons.length} Lessons</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">R</div>
              <div>
                <p className="text-xs text-gray-500">Instructor</p>
                <p className="text-sm font-semibold text-white">RoboON Engineering Team</p>
              </div>
            </div>
          </div>

          {/* Floating Checkout Card */}
          <div className="lg:w-1/3 lg:-mt-24 lg:mb-[-100px] z-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-white/10 sticky top-24"
            >
              <div className="w-full aspect-video bg-gray-900 rounded-xl mb-6 relative flex items-center justify-center overflow-hidden border border-white/5 cursor-pointer group">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                 <PlayCircle size={64} className="text-white z-10 group-hover:scale-110 transition-transform shadow-2xl" />
                 <span className="absolute bottom-3 pb-1 border-b-2 border-primary z-10 font-medium">Preview Course</span>
              </div>
              
              <div className="mb-6 flex items-end gap-3">
                <span className="text-4xl font-extrabold text-white">{price}</span>
                <span className="text-sm font-semibold text-green-400 mb-1 ml-auto">LIMITED OFFER</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-primary text-black font-bold py-3.5 rounded-xl hover:bg-white transition-colors transform hover:-translate-y-0.5 shadow-lg shadow-primary/20"
                >
                  Enroll Now
                </button>
                <div className="text-center text-xs text-gray-500 mt-2 flex flex-col gap-1">
                  <span>Pay with bKash or Nagad</span>
                  <span>Access after manual verification</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-sm font-semibold text-white">This course includes:</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2"><PlayCircle size={16} className="text-primary"/> {lessons.length > 0 ? `${lessons.length * 10} min video` : "15 hours on-demand video"}</li>
                  <li className="flex items-center gap-2"><FileText size={16} className="text-primary"/> Downloadable resources</li>
                  <li className="flex items-center gap-2"><Award size={16} className="text-primary"/> Certificate of completion</li>
                  <li className="flex items-center gap-2"><Clock size={16} className="text-primary"/> Full lifetime access</li>
                </ul>
                <button className="flex items-center justify-center gap-2 w-full text-sm font-medium text-gray-400 hover:text-white pt-2 transition-colors">
                  <Share2 size={16} /> Share Course
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          
          <h2 className="text-2xl font-bold text-white mb-6">What you'll learn</h2>
          <div className="glass p-6 rounded-xl border border-white/5 mb-12">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Understand Architecture from edge to cloud", "Program Embedded microcontrollers", "Implement protocols for real-time telemetry", "Build custom dashboards with React", "Secure data transmission", "Optimize systems for low power"].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300 items-start">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Course Syllabus</h2>
          <div className="space-y-4">
            {lessons.length === 0 ? (
               <div className="glass p-10 rounded-2xl border border-white/5 text-center text-gray-500 italic font-medium">
                  The syllabus is currently being populated. Check back soon for the full curriculum!
               </div>
            ) : (
                <div className="glass p-5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-4 cursor-default group">
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors">Course Lectures</h3>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{lessons.length} lessons • {lessons.length * 10} min</span>
                  </div>
                  <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                    {lessons.map((lesson, lecIdx) => (
                      <div key={lesson.id} className="flex justify-between items-center text-sm p-3 hover:bg-white/5 rounded-lg transition-colors cursor-default group border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-gray-500 group-hover:bg-primary group-hover:text-black transition-colors">
                            {lecIdx + 1}
                          </div>
                          <PlayCircle size={16} className="text-gray-500 group-hover:text-primary transition-colors" />
                          <span className="text-gray-300 group-hover:text-white transition-colors">{lesson.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
            )}
            
            {/* Start Learning Callout for testing the streaming UI */}
            <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-xl relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 transform-gpu" style={{ background: 'radial-gradient(circle, rgba(60,179,150,0.15) 0%, rgba(60,179,150,0) 70%)' }}></div>
               <h3 className="text-lg font-bold text-white mb-2">Already purchased?</h3>
               <p className="text-sm text-gray-400 mb-4">Go to your dashboard to start learning immediately.</p>
               <Link href={`/learn/${params.id}`} className="inline-flex items-center gap-2 bg-primary text-black font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-white transition-colors">
                 Go to Course Player <PlayCircle size={16} />
               </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
