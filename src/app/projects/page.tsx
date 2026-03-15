"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Code2, Cpu, Wrench } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          icon: doc.data().category === 'Robotics' ? Wrench : Cpu
        }));
        
        if (projectsData.length === 0) {
          // No projects in DB yet
          setProjects([]);
        } else {
          setProjects(projectsData);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="w-full flex justify-center pb-32 relative overflow-hidden">
      <div className="absolute top-40 left-0 -translate-x-1/4 text-primary/5 pointer-events-none -z-10">
         <Cpu size={800} strokeWidth={0.5} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative z-10">
        
        <div className="text-center mb-12 sm:mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full -z-10 pointer-events-none transform-gpu" style={{ background: 'radial-gradient(circle, rgba(60,179,150,0.15) 0%, rgba(60,179,150,0) 70%)' }} />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white px-4"
          >
            Featured <span className="text-gradient">Projects</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto px-6"
          >
            A showcase of our most recent and innovative work across robotics, embedded systems, and software engineering.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden group border border-white/5 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(255,87,34,0.15)] flex flex-col"
            >
              {/* Project Image Header */}
              <div className="relative h-64 bg-gray-900 flex items-center justify-center overflow-hidden">
                {/* Removed grid pattern */}
                
                {/* Simulated Image Placeholder with glowing icon */}
                <div className="relative z-10 p-6 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                   <project.icon size={48} className="text-white/70 group-hover:text-primary transition-colors duration-500" />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0414] to-transparent z-0 opacity-80" />
                
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-black/60 backdrop-blur-md text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-8 flex-grow flex flex-col relative z-20 -mt-6 bg-[#0a0414]/90 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors cursor-pointer flex items-center justify-between">
                  {project.title}
                  <ExternalLink size={20} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>
                
                <div className="mt-auto">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech: string) => (
                      <span key={tech} className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-md border border-white/5 transition-colors cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-gray-400 mb-6">Have a challenging idea in mind?</p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-primary text-black hover:bg-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(60,179,150,0.3)]">
            Let's Build It Together <Wrench size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
