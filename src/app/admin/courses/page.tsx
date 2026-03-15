"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, MoreVertical, Loader2, PlayCircle, X as CloseIcon, Clock, Link as LinkIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc } from "firebase/firestore";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
  category: string;
  price: string;
  status: string;
  students: number;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  
  // New Course Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("IoT");
  const [newPrice, setNewPrice] = useState("৳1,000");
  const [newImage, setNewImage] = useState("");

  // Lesson Management State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonUrl, setLessonUrl] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      setLoadingLessons(true);
      const lessonsRef = collection(db, "courses", courseId, "lessons");
      const q = query(lessonsRef, orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const lessonsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lesson[];
      setLessons(lessonsData);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoadingLessons(false);
    }
  };

  useEffect(() => {
    // Only attempt to fetch if process.env values are set, otherwise mock
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key") {
      fetchCourses();
    } else {
      setCourses([
        { id: "mock1", title: "Internet of Things Masterclass", category: "IoT", price: "৳2,500", status: "Published", students: 1250 },
        { id: "mock2", title: "Basic Robotics from Scratch", category: "Robotics", price: "৳1,800", status: "Published", students: 3420 },
      ]);
      setLoading(false);
    }
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      if (editingCourseId) {
        const docRef = doc(db, "courses", editingCourseId);
        await updateDoc(docRef, {
          title: newTitle,
          category: newCategory,
          price: newPrice,
          image: newImage,
        });
        
        setCourses(courses.map(c => c.id === editingCourseId ? {
          ...c,
          title: newTitle,
          category: newCategory,
          price: newPrice,
          image: newImage,
        } : c));
      } else {
        const docRef = await addDoc(collection(db, "courses"), {
          title: newTitle,
          category: newCategory,
          price: newPrice,
          image: newImage,
          status: "Published",
          students: 0,
          createdAt: serverTimestamp()
        });
        
        setCourses([...courses, {
          id: docRef.id,
          title: newTitle,
          category: newCategory,
          price: newPrice,
          status: "Published",
          students: 0
        }]);
      }
      
      setIsAdding(false);
      setEditingCourseId(null);
      setNewTitle("");
      setNewImage("");
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course. Make sure Firebase config is correct.");
    }
  };

  const handleEditCourse = (course: Course) => {
    setNewTitle(course.title);
    setNewCategory(course.category);
    setNewPrice(course.price);
    setNewImage((course as any).image || "");
    setEditingCourseId(course.id);
    setIsAdding(true);
  };

  const openAddForm = () => {
    setNewTitle("");
    setNewCategory("IoT");
    setNewPrice("৳1,000");
    setNewImage("");
    setEditingCourseId(null);
    setIsAdding(!isAdding);
  };

  const handleDeleteCourse = async (id: string, isMock: boolean) => {
    if (isMock) {
      setCourses(courses.filter(c => c.id !== id));
      return;
    }
    
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "courses", id));
        setCourses(courses.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !lessonTitle || !lessonUrl) return;

    try {
      if (editingLessonId) {
        const lessonRef = doc(db, "courses", selectedCourse.id, "lessons", editingLessonId);
        await updateDoc(lessonRef, {
          title: lessonTitle,
          videoUrl: lessonUrl,
          duration: lessonDuration || "10:00",
        });
        setLessons(lessons.map(l => l.id === editingLessonId ? { 
          ...l, 
          title: lessonTitle, 
          videoUrl: lessonUrl, 
          duration: lessonDuration || "10:00" 
        } : l));
      } else {
        const lessonsRef = collection(db, "courses", selectedCourse.id, "lessons");
        const order = lessons.length + 1;
        const docRef = await addDoc(lessonsRef, {
          title: lessonTitle,
          videoUrl: lessonUrl,
          duration: lessonDuration || "10:00",
          order,
          createdAt: serverTimestamp()
        });

        setLessons([...lessons, {
          id: docRef.id,
          title: lessonTitle,
          videoUrl: lessonUrl,
          duration: lessonDuration || "10:00",
          order
        }]);
      }

      setLessonTitle("");
      setLessonUrl("");
      setLessonDuration("");
      setIsAddingLesson(false);
      setEditingLessonId(null);
    } catch (error) {
      console.error("Error saving lesson:", error);
      alert("Failed to save lesson.");
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setLessonTitle(lesson.title);
    setLessonUrl(lesson.videoUrl);
    setLessonDuration(lesson.duration);
    setEditingLessonId(lesson.id);
    setIsAddingLesson(true);
  };

  const openAddLessonForm = () => {
    setLessonTitle("");
    setLessonUrl("");
    setLessonDuration("");
    setEditingLessonId(null);
    setIsAddingLesson(!isAddingLesson);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!selectedCourse) return;
    if (confirm("Delete this lesson?")) {
      try {
        await deleteDoc(doc(db, "courses", selectedCourse.id, "lessons", lessonId));
        setLessons(lessons.filter(l => l.id !== lessonId));
      } catch (error) {
        console.error("Error deleting lesson:", error);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    try {
      await updateDoc(doc(db, "courses", id), { status: newStatus });
      setCourses(courses.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Course Management</h1>
          <p className="text-gray-400 text-sm">Create, edit, and manage your e-learning platform content.</p>
        </div>
        
        <button 
          onClick={openAddForm}
          className="bg-primary text-black font-bold px-6 py-2.5 rounded-full hover:bg-white transition-colors flex items-center gap-2 shadow-[0_4px_15px_rgba(255,87,34,0.3)]"
        >
          <Plus size={18} /> {isAdding && !editingCourseId ? 'Cancel' : 'New Course'}
        </button>
      </div>

      {isAdding && (
         <form onSubmit={handleAddCourse} className="mb-8 p-6 glass-card rounded-2xl border border-white/10 flex flex-wrap gap-4 items-end animate-in fade-in slide-in-from-top-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-gray-400 mb-1 font-medium">Course Title</label>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="e.g. Advanced ROS 2" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-gray-400 mb-1 font-medium">Image URL</label>
              <input type="url" value={newImage} onChange={e => setNewImage(e.target.value)} placeholder="https://unsplash.com/..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <div className="w-40">
               <label className="block text-xs text-gray-400 mb-1 font-medium">Category</label>
               <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary">
                 <option>IoT</option><option>Robotics</option><option>Hardware</option><option>Software</option>
               </select>
            </div>
            <div className="w-32">
              <label className="block text-xs text-gray-400 mb-1 font-medium">Price</label>
              <input type="text" value={newPrice} onChange={e => setNewPrice(e.target.value)} required placeholder="৳0" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <button type="submit" className="bg-white/10 hover:bg-white text-white hover:text-black font-semibold px-6 py-2 rounded-lg transition-colors">
              Save Course
            </button>
         </form>
      )}

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 text-white transition-colors"
            />
          </div>
          
          <select className="bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary/50 hidden sm:block">
            <option>All Statuses</option>
            <option>Published</option>
            <option>Drafts</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
               <p>No courses found in database.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">Course Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Students</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-medium text-white group-hover:text-primary transition-colors">
                      {course.title}
                    </td>
                    <td className="p-4 text-gray-400">{course.category}</td>
                    <td className="p-4 font-semibold text-gray-300">{course.price}</td>
                    <td className="p-4 text-gray-400">{course.students?.toLocaleString() || 0}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleStatus(course.id, course.status)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${
                        course.status === 'Published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      }`}>
                        {course.status}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setSelectedCourse(course);
                            fetchLessons(course.id);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-black transition-all"
                        >
                          <PlayCircle size={14} /> Lessons
                        </button>
                        <button 
                          onClick={() => handleEditCourse(course)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id, course.id.startsWith("mock"))}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors sm:hidden" title="More options">
                           <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Lesson Management Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center glass">
                 <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <PlayCircle className="text-primary" /> Lessons Management
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">{selectedCourse.title}</p>
                 </div>
                 <button 
                   onClick={() => setSelectedCourse(null)}
                   className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                 >
                   <CloseIcon size={24} />
                 </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
                 {/* Lesson List */}
                 <div className="flex-[3]">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-white font-semibold">Course Curriculum</h3>
                       <button 
                         onClick={() => setIsAddingLesson(!isAddingLesson)}
                         className="text-xs font-bold text-primary hover:text-white flex items-center gap-1 transition-colors"
                       >
                         <Plus size={14} /> {isAddingLesson ? 'Cancel' : 'Add New Lesson'}
                       </button>
                    </div>

                    {isAddingLesson && (
                       <form onSubmit={handleAddLesson} className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 space-y-4 animate-in slide-in-from-top-2">
                          <div>
                             <label className="block text-xs text-gray-500 mb-1">Lesson Title</label>
                             <input 
                               required
                               type="text" 
                               value={lessonTitle}
                               onChange={e => setLessonTitle(e.target.value)}
                               placeholder="e.g. 1.1 Introduction to Electronics"
                               className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-primary"
                             />
                          </div>
                          <div className="flex gap-4">
                             <div className="flex-[3]">
                                <label className="block text-xs text-gray-500 mb-1">Video Source URL (YouTube/Direct)</label>
                                <div className="relative">
                                   <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                   <input 
                                     required
                                     type="text" 
                                     value={lessonUrl}
                                     onChange={e => setLessonUrl(e.target.value)}
                                     placeholder="https://youtube.com/watch?v=..."
                                     className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm outline-none focus:border-primary"
                                   />
                                </div>
                             </div>
                             <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Duration</label>
                                <div className="relative">
                                   <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                   <input 
                                     type="text" 
                                     value={lessonDuration}
                                     onChange={e => setLessonDuration(e.target.value)}
                                     placeholder="10:00"
                                     className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm outline-none focus:border-primary"
                                   />
                                </div>
                             </div>
                          </div>
                          <button type="submit" className="w-full bg-primary text-black font-bold py-2 rounded-lg hover:bg-white transition-all text-sm">
                             Submit Lesson
                          </button>
                       </form>
                    )}

                    <div className="space-y-3">
                       {loadingLessons ? (
                         <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
                       ) : lessons.length === 0 ? (
                         <div className="text-center py-12 text-gray-600 border-2 border-dashed border-white/5 rounded-2xl">
                            <PlayCircle size={40} className="mx-auto mb-2 opacity-20" />
                            <p>No lessons added yet.</p>
                         </div>
                       ) : (
                         lessons.map((lesson, idx) => (
                           <div key={lesson.id} className="group p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between hover:border-primary/30 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-primary group-hover:text-black transition-colors">
                                    {idx + 1}
                                 </div>
                                 <div>
                                    <h4 className="text-white text-sm font-medium">{lesson.title}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                       <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                          <Clock size={10} /> {lesson.duration}
                                       </span>
                                       <span className="text-[10px] text-gray-500 flex items-center gap-1 truncate max-w-[150px]">
                                          <LinkIcon size={10} /> {lesson.videoUrl}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                 <button 
                                   onClick={() => handleEditLesson(lesson)}
                                   className="p-2 text-gray-500 hover:text-white transition-colors"
                                 >
                                    <Edit2 size={16} />
                                 </button>
                                 <button 
                                   onClick={() => handleDeleteLesson(lesson.id)}
                                   className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </div>
                         ))
                       )}
                    </div>
                 </div>

                 {/* Tips Section */}
                 <div className="flex-1 bg-white/5 rounded-2xl p-5 border border-white/5">
                    <h3 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2">Guidance</h3>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Video Sources</p>
                          <p className="text-[11px] text-gray-400 leading-relaxed">
                             System supports YouTube, Google Drive, and direct .mp4 links.
                          </p>
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Google Drive Tips</p>
                          <p className="text-[11px] text-gray-400 leading-relaxed">
                             Ensure the file permission is set to **"Anyone with the link"**. Use the standard share link.
                          </p>
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Ordering</p>
                          <p className="text-[11px] text-gray-400 leading-relaxed">
                             Lessons are automatically ordered by the sequence they are added.
                          </p>
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Student View</p>
                          <p className="text-[11px] text-gray-400 leading-relaxed">
                             Once added, lessons appear immediately in the course player for enrolled students.
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
