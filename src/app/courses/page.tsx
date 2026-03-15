"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Star, Clock, BookOpen, PlayCircle, Filter, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const q = query(
          collection(db, "courses"), 
          where("status", "==", "Published"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const categories = ["All", "Robotics", "IoT", "Hardware", "Software"];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full flex justify-center pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 pt-4 md:pt-8">
          <div className="max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              Learn with <span className="text-primary">RoboON</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-base md:text-lg text-gray-400"
            >
              Industry-grade courses taught by practicing engineers. Stream recorded sessions anytime and master practical skills.
            </motion.p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 max-w-full">
            <div className="relative w-full sm:w-64 max-w-full overflow-hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-white transition-colors"
              />
            </div>
            <button className="bg-white/5 border border-white/10 rounded-full px-6 py-2.5 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors w-full sm:w-auto shrink-0 overflow-hidden">
              <Filter size={18} />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-12 gap-3 hide-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-primary text-black' : 'glass hover:bg-white/10 text-gray-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20 w-full">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 w-full text-gray-500">
             <p>No published courses found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden group flex flex-col hover:border-primary/40 transition-all hover:shadow-[0_8px_30px_rgba(11,244,227,0.15)]"
              >
                <div className="relative h-56 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden">
                  <img 
                    src={course.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"} 
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                      {course.category}
                    </span>
                    <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20">
                      Intermediate
                    </span>
                  </div>
                  <PlayCircle size={56} className="text-white/40 group-hover:text-primary transition-colors group-hover:scale-110 duration-300 relative z-10" />
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                      <Star size={14} fill="currentColor" /> 4.9 <span className="text-gray-500 ml-1">({course.students || 0})</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                    <Link href={`/courses/${course.id}`}>{course.title}</Link>
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary"/> 15 Hours</span>
                    <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-primary"/> Modules</span>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-0.5">Price</span>
                      <span className="text-2xl font-bold text-white leading-none">{course.price}</span>
                    </div>
                    <Link 
                      href={`/courses/${course.id}`} 
                      className="bg-white/10 hover:bg-primary hover:text-black px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
