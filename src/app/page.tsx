"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, Laptop, Zap, Settings, Cpu, Cuboid, PlayCircle, Star, Share2, Phone } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, limit, orderBy, where } from "firebase/firestore";

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Programmatic manual play trigger for mobile devices (iOS Safari Friendly)
  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
    };

    // Try playing immediately
    playVideo();

    // Fallback for strict iOS logic: play on first user interaction
    const handleGesture = () => {
      playVideo();
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('click', handleGesture);
    };

    window.addEventListener('touchstart', handleGesture);
    window.addEventListener('click', handleGesture);

    return () => {
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('click', handleGesture);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const courseQuery = query(
          collection(db, "courses"),
          where("status", "==", "Published"),
          limit(3)
        );
        const projectQuery = query(collection(db, "projects"), limit(3), orderBy("createdAt", "desc"));

        const [courseSnap, projectSnap] = await Promise.all([
          getDocs(courseQuery),
          getDocs(projectQuery)
        ]);

        const courses = courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const projects = projectSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setFeaturedCourses(courses.length > 0 ? courses : [
          { title: "Internet of Things Masterclass", instructor: "RoboON Team", price: "৳2,500", rating: 4.9 },
          { title: "Basic Robotics from Scratch", instructor: "RoboON Team", price: "৳1,800", rating: 4.8 },
          { title: "PCB Design with Altium", instructor: "RoboON Team", price: "৳3,500", rating: 5.0 },
        ]);

        setFeaturedProjects(projects.length > 0 ? projects : [
          { title: "Autonomous Hexapod", category: "Robotics", image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=800", desc: "6-legged bio-inspired robot." },
          { title: "Industrial Flight Controller", category: "PCB Design", image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800", desc: "High-integrity flight control system." },
          { title: "IoT Smart Home Ecosystem", category: "IoT", image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=800", desc: "Unified cloud-controlled automation suite." }
        ]);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const services = [
    { title: "Embedded Systems", icon: Cpu, desc: "Custom firmware and hardware solutions." },
    { title: "Robotics", icon: Zap, desc: "Automated systems and intelligent robots." },
    { title: "PCB Design", icon: Settings, desc: "Professional schematic and layout services." },
    { title: "3D Design", icon: Cuboid, desc: "Rapid prototyping and CAD modeling." },
    { title: "App & Web Dev", icon: Code, desc: "Modern, scalable software applications." },
    { title: "IoT Projects", icon: Laptop, desc: "Connected devices and cloud platforms." },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Hero Section */}
      {/* 
        CUSTOMIZE GAP HERE:
        Change the gap-[1rem] value below to adjust the exact distance between the display and headline on mobile & tablet.
      */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:py-32 flex flex-col-reverse lg:flex-row items-center justify-between gap-[1rem] lg:gap-12">
        {/* Microcontroller Watermark */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 text-primary/5 pointer-events-none">
          <Cpu size={800} strokeWidth={0.5} />
        </div>

        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-full max-h-[600px] rounded-full pointer-events-none transform-gpu" style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, rgba(22,163,74,0) 70%)' }} />

        {/* Left Side: Text Components */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-3xl"
          >
            Build the Future with <br className="hidden xl:block" />
            <span className="text-gradient">RoboON</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 mb-10 max-w-2xl px-4 lg:px-0"
          >
            Your premier partner for Embedded Systems, Robotics, PCB Design, Software Development, and expert-led Online Courses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/services" className="bg-primary text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(11,244,227,0.4)]">
              Explore Services <ArrowRight size={20} />
            </Link>
            <Link href="/courses" className="glass px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              View Courses
            </Link>
          </motion.div>
        </div>

        {/* Soft glow behind the video (outside the screen wrapper) */}
        <div 
          className="absolute top-1/2 right-0 -translate-y-1/2 w-full max-w-[500px] h-full max-h-[500px] rounded-full pointer-events-none transform-gpu opacity-20" 
          style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, rgba(22,163,74,0) 70%)' }} 
        />

        {/* Right Side: Video Components (Matches Navbar Animation) */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="flex-1 w-full max-w-xl lg:max-w-none flex justify-center"
        >
          <div className="w-full flex items-center justify-center lg:w-[600px] relative">
            <video
              id="hero-video"
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-contain origin-center pointer-events-none"
              style={{ clipPath: 'inset(0% 0% 14% 0%)' }}
              onCanPlay={() => {
                if (videoRef.current) {
                  videoRef.current.muted = true;
                  videoRef.current.play();
                }
              }}
            >
              <source src="/robo-on-website/hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="w-full relative py-20 border-t border-white/10 bg-black/50 overflow-hidden">
        {/* Network Watermark */}
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 text-primary/5 pointer-events-none">
          <Share2 size={600} strokeWidth={0.5} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our <span className="text-primary">Expertise</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">From concept to production, we deliver high-quality engineering and software solutions tailored to your needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="glass-card p-6 rounded-2xl group hover:border-primary/50 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <service.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="w-full relative py-24 overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-full max-h-[500px] rounded-full -z-10 pointer-events-none transform-gpu" style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.1) 0%, rgba(22,163,74,0) 70%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Innovative <span className="text-primary">Showcase</span></h2>
              <p className="text-gray-400 text-lg">A glimpse into the cutting-edge systems and products we've engineered for clients worldwide.</p>
            </div>
            <Link href="/projects" className="group flex items-center gap-2 text-white font-bold hover:text-primary transition-colors">
              Explore Portfolio <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 glass-card"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={project.image || "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=800"}
                    alt={project.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[10px] uppercase font-bold text-primary tracking-widest leading-none">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{project.desc}</p>
                  <Link href={project.id?.startsWith('mock') ? '#' : `/projects/${project.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
                    View Project Detail <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="w-full relative py-20 pb-32 overflow-hidden">
        {/* Secondary Microcontroller Watermark */}
        <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 text-primary/5 pointer-events-none">
          <Cpu size={500} strokeWidth={0.5} />
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-[500px] h-full max-h-[500px] rounded-full -z-10 pointer-events-none transform-gpu" style={{ background: 'radial-gradient(circle, rgba(41,42,58,0.4) 0%, rgba(41,42,58,0) 70%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Level Up Your <span className="text-primary">Skills</span></h2>
              <p className="text-gray-400 max-w-xl">Join our comprehensive e-learning platform and master in-demand technologies straight from industry experts.</p>
            </div>
            <Link href="/courses" className="text-primary hover:text-white flex items-center gap-2 font-medium transition-colors">
              Browse all courses <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden group flex flex-col"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-900 to-[#0a0414] flex items-center justify-center overflow-hidden">
                  <img src={course.image || "https://www.transparenttextures.com/patterns/cubes.png"} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500" />
                  <PlayCircle size={48} className="text-white/50 group-hover:text-primary transition-colors group-hover:scale-110 duration-300 relative z-10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
                    <Share2 size={150} strokeWidth={1} />
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary rounded-md">Bestseller</span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                      <Star size={14} fill="currentColor" /> {course.rating || '5.0'}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-400 mb-6">By {course.instructor || 'RoboON Team'}</p>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-2xl font-bold text-white">{course.price}</span>
                    <Link href={`/courses/${course.id || course.title.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-semibold hover:text-primary transition-colors">
                      Learn More →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="w-full relative py-32 overflow-hidden bg-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-full max-h-[400px] rounded-full pointer-events-none transform-gpu overflow-hidden" style={{ background: 'radial-gradient(ellipse, rgba(22,163,74,0.1) 0%, rgba(22,163,74,0) 70%)' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-20 rounded-[40px] border border-white/10 relative overflow-hidden"
          >
            {/* Watermark inside card */}
            <div className="absolute -bottom-20 -right-20 text-white/5 pointer-events-none">
              <Zap size={300} strokeWidth={1} />
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
              Let's Build It <span className="text-primary">Together</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Have a revolutionary idea in Robotics or IoT? Our team of experts is ready to help you engineer, prototype, and scale your vision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 bg-primary text-black px-12 py-5 rounded-full font-bold text-xl hover:bg-white transition-all shadow-[0_0_40px_rgba(22,163,74,0.4)] active:scale-95 group w-full sm:w-auto"
              >
                Start Your Project <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <a
                href="https://wa.me/8801319759370"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-[#25D366] transition-all shadow-[0_0_40px_rgba(37,211,102,0.3)] active:scale-95 group w-full sm:w-auto"
              >
                Chat on WhatsApp <Phone size={24} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
