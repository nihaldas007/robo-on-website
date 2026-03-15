"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, PlayCircle, Menu, X, CheckCircle, FileText, MessageSquare, Loader2, Settings, Clock, Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  order: number;
}

export default function CoursePlayerClient() {
  const params = useParams();
  const { user, userData, role, loading: authLoading } = useAuth();
  const courseId = params.courseId as string;
  const [courseTitle, setCourseTitle] = useState("Course");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  useEffect(() => {
    // Auto-close sidebar on mobile devices on initial load
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      if (authLoading) return;
      
      if (!user) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      // Admin and Moderators have full access
      if (role === 'admin' || role === 'moderator') {
        setIsAuthorized(true);
        return;
      }

      // Check if course is in user's enrolledCourses
      const enrolledCourses = userData?.enrolledCourses || [];
      if (enrolledCourses.includes(courseId)) {
        setIsAuthorized(true);
        // Loading will be handled by fetchCourseData
      } else {
        // Check if there is a pending enrollment
        try {
          const { collection, getDocs, query, where } = await import("firebase/firestore");
          const enrollmentsRef = collection(db, "enrollments");
          
          // Use a simpler query if composite index is missing
          const q = query(
            enrollmentsRef, 
            where("userId", "==", user.uid)
          );
          
          const enrollSnap = await getDocs(q);
          const pendingMatch = enrollSnap.docs.find(d => 
            d.data().courseId === courseId && d.data().status === "pending"
          );
          
          if (pendingMatch) {
            setIsPending(true);
          }
        } catch (err) {
          console.error("Error checking pending enrollment:", err);
          // Just fall back to unauthorized
        }
        setIsAuthorized(false);
        setLoading(false);
      }
    }
    checkAccess();
  }, [user, userData, role, authLoading, courseId]);

  useEffect(() => {
    async function fetchCourseData() {
      if (isAuthorized === false || isAuthorized === null) return;
      
      try {
        setLoading(true);
        // Fetch Course Title
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (courseDoc.exists()) {
          setCourseTitle(courseDoc.data().title);
        }

        // Fetch Lessons
        const lessonsRef = collection(db, "courses", courseId, "lessons");
        const q = query(lessonsRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const lessonsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lesson[];

        setLessons(lessonsData);
        if (lessonsData.length > 0) {
          setActiveLesson(lessonsData[0]);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, [courseId, isAuthorized]);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    // YouTube
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    // Google Drive
    if (url.includes("drive.google.com")) {
      // Convert /view or /open to /preview
      if (url.includes("/view")) {
        return url.replace("/view", "/preview");
      }
      if (url.includes("id=")) {
        const id = new URL(url).searchParams.get("id");
        return `https://drive.google.com/file/d/${id}/preview`;
      }
    }
    return url;
  };

  const isEmbeddable = (url: string) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be") || url?.includes("drive.google.com");
  };

  // Unauthorized UI
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-card p-10 rounded-[32px] border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 transform-gpu" style={{ background: 'radial-gradient(circle, rgba(60,179,150,0.1) 0%, rgba(60,179,150,0) 70%)' }} />
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20">
            {isPending ? <Clock size={40} className="text-primary animate-pulse" /> : <Lock size={40} className="text-primary" />}
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {isPending ? "Verification in Progress" : "Neural Access Denied"}
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {isPending 
              ? "Your enrollment request is currently being reviewed by our engineering team. Access will be granted automatically once your payment is verified (usually within 1-2 hours). If you already paid and were approved, try refreshing the page."
              : "You haven't enrolled in this module yet. Please complete the enrollment process to access the secure stream."}
          </p>
          <div className="space-y-4">
            {!isPending && (
              <Link 
                href={`/courses/${courseId}`}
                className="block w-full bg-primary text-black font-bold py-4 rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_rgba(60,179,150,0.3)]"
              >
                Enroll in Course
              </Link>
            )}
            <Link 
              href="/dashboard"
              className="block w-full bg-white/5 text-white font-semibold py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading || (isAuthorized === null && loading)) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase">Authorizing...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-[#060606] lg:overflow-hidden">
      
      {/* Video Stream Area */}
      <div className="flex-1 flex flex-col min-h-0 relative w-full overflow-x-hidden">
        
        {/* Top Header inside player */}
        <div className="h-14 md:h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-30 shrink-0">
          <div className="flex items-center gap-4 overflow-hidden">
            <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-white/10 shrink-0">
              <ChevronLeft size={20} />
            </Link>
            <div className="overflow-hidden">
              <h2 className="text-white font-bold text-sm md:text-base leading-tight truncate">{courseTitle}</h2>
              <p className="text-primary text-[10px] md:text-xs font-semibold tracking-wide uppercase mt-0.5">{activeLesson?.title || "Loading..."}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="p-2 text-gray-400 hover:text-white transition-colors">
               <Settings size={20} />
             </button>
             <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-primary hover:text-white transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="flex-shrink-0 bg-black relative flex items-center justify-center overflow-hidden aspect-video lg:flex-1 lg:aspect-auto">
           <div className="w-full h-full max-h-full aspect-video shadow-[0_0_100px_rgba(255,87,34,0.1)] relative">
             {loading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]">
                  <Loader2 className="animate-spin text-primary" size={40} />
                  <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase">Initializing Stream...</p>
               </div>
             ) : activeLesson ? (
                isEmbeddable(activeLesson.videoUrl) ? (
                 <iframe 
                   src={getEmbedUrl(activeLesson.videoUrl)}
                   className="w-full h-full border-0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 ></iframe>
               ) : (
                 <video 
                   src={activeLesson.videoUrl}
                   controls
                   className="w-full h-full"
                   poster="/video-poster.jpg"
                 ></video>
               )
             ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[#0a0a0a]">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                    <PlayCircle size={40} className="text-white/20" />
                  </div>
                  <h3 className="font-bold text-xl text-white/50 tracking-tight">Accessing Neural Link...</h3>
                  <p className="text-sm text-gray-600 mt-2 max-w-sm">No lessons found on this frequency. Please check back later.</p>
               </div>
             )}
           </div>
        </div>

        {/* Course Info Tabs Below Video */}
        <div className="flex-1 lg:flex-none lg:h-auto overflow-y-auto p-4 md:p-8 custom-scrollbar bg-black/20">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-8 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
              <button className="pb-4 border-b-2 border-primary text-white font-bold text-xs uppercase tracking-widest">Overview</button>
              <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-white font-bold text-xs uppercase tracking-widest flex gap-2 shrink-0"><FileText size={14}/> Resources</button>
              <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-white font-bold text-xs uppercase tracking-widest flex gap-2 shrink-0"><MessageSquare size={14}/> Discussion</button>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">{activeLesson?.title || courseTitle}</h1>
            <p className="text-gray-400 leading-relaxed mb-8 text-sm sm:text-base">
              Dive deep into the fundamentals of engineering. This lesson covers key concepts required to master the module. 
              Be sure to check the resources tab for practice files and documentation.
            </p>
            
            <div className="inline-flex gap-4 items-center p-1 pr-6 bg-white/5 rounded-full border border-white/5">
               <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-bold">R</div>
               <div>
                 <h4 className="text-white font-bold text-xs">RoboON Engineering</h4>
                 <p className="text-[10px] text-gray-500">Course Instructors</p>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sidebar Syllabus */}
      <div 
        className={`w-full lg:w-80 border-l border-white/5 bg-[#080808] flex flex-col transition-all duration-300 fixed lg:relative inset-y-0 right-0 z-40 lg:z-10 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:hidden"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0 bg-[#0c0c0c]">
          <h3 className="font-bold text-white text-sm uppercase tracking-widest">Syllabus</h3>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary" size={24} />
              <p className="text-[10px] text-gray-500 font-mono">LOADING MODULES...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-600 text-xs italic">No transmissions found.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {lessons.map((lesson, idx) => {
                const isActive = activeLesson?.id === lesson.id;
                return (
                  <button 
                    key={lesson.id} 
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full p-4 flex gap-4 text-left transition-all rounded-xl border ${isActive ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' : 'hover:bg-white/5 border-transparent'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${isActive ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/5 text-gray-600'}`}>
                       {isActive ? <PlayCircle size={16} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                    </div>
                    <div className="overflow-hidden">
                      <span className={`block truncate text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-gray-400'}`}>{lesson.title}</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-gray-600 flex items-center gap-1 font-mono uppercase">
                          <Clock size={10}/> {lesson.duration}
                        </span>
                        {isActive && <span className="text-[10px] text-primary font-bold uppercase tracking-tighter italic">Now Playing</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
