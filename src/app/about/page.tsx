"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter, Share2, Cpu } from "lucide-react";
import Link from "next/link";

export default function About() {
  const team = [
    {
      name: "Alex Mercer",
      role: "Founder & Lead Engineer",
      image: "https://i.pravatar.cc/300?img=11",
      bio: "10+ years experience in embedded systems and aerospace robotics.",
      socials: { linkedin: "#", github: "#", twitter: "#" }
    },
    {
      name: "Sarah Chen",
      role: "Head of Software",
      image: "https://i.pravatar.cc/300?img=5",
      bio: "Full-stack architect specializing in cloud infrastructure and IoT pipelines.",
      socials: { linkedin: "#", github: "#", twitter: "#" }
    },
    {
      name: "Marcus Johnson",
      role: "Hardware Design Lead",
      image: "https://i.pravatar.cc/300?img=12",
      bio: "Expert in high-speed PCB layouts and RF integrations for autonomous vehicles.",
      socials: { linkedin: "#", github: "#", twitter: "#" }
    },
    {
      name: "Elena Rodriguez",
      role: "Director of Education",
      image: "https://i.pravatar.cc/300?img=9",
      bio: "Passionate about making complex engineering concepts accessible to everyone.",
      socials: { linkedin: "#", github: "#", twitter: "#" }
    }
  ];

  return (
    <div className="w-full pb-32 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 translate-x-1/4 text-primary/5 pointer-events-none -z-10">
         <Share2 size={800} strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-1/4 left-0 -translate-x-1/4 text-primary/5 pointer-events-none -z-10">
         <Cpu size={800} strokeWidth={0.5} />
      </div>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Removed grid pattern */}
        <div className="absolute top-0 right-0 w-full max-w-[500px] h-full max-h-[500px] rounded-full -z-10 transform-gpu" style={{ background: 'radial-gradient(circle, rgba(41,42,58,0.3) 0%, rgba(41,42,58,0) 70%)' }}></div>
        <div className="absolute bottom-0 left-0 w-full max-w-[500px] h-full max-h-[500px] rounded-full -z-10 transform-gpu" style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.1) 0%, rgba(22,163,74,0) 70%)' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white"
          >
            Engineering the <span className="text-gradient">Unknown</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
          >
            At RoboON, we blend hardware precision with software scalability to solve the world's most complex technical challenges.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">Our Mission</h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Founded in a garage by a team of frustrated engineers, RoboON was created to bridge the widening gap between the physical and digital worlds. 
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                We believe that true innovation happens at the intersection of embedded hardware, intelligent robotics, and robust software architectures. That's why we don't just act as consultants—we build the future alongside our clients, and we teach the next generation of engineers through our comprehensive learning platform.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 pt-12">
                <div className="glass-card p-6 rounded-2xl border-t border-primary/30">
                  <h3 className="text-4xl font-extrabold text-white mb-2">50+</h3>
                  <p className="text-sm text-gray-400">Projects Delivered</p>
                </div>
                <div className="glass-card p-6 rounded-2xl border-b border-secondary/50">
                  <h3 className="text-4xl font-extrabold text-white mb-2">15k+</h3>
                  <p className="text-sm text-gray-400">Enrolled Students</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass-card p-6 rounded-2xl border-t border-secondary/50">
                  <h3 className="text-4xl font-extrabold text-white mb-2">10+</h3>
                  <p className="text-sm text-gray-400">Years Industry Exp.</p>
                </div>
                <div className="glass-card p-6 rounded-2xl border-b border-primary/30">
                  <h3 className="text-4xl font-extrabold text-white mb-2">24/7</h3>
                  <p className="text-sm text-gray-400">Support & Dedication</p>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet the <span className="text-primary">Minds</span></h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Our multi-disciplinary team of experts is the driving force behind every circuit we print and every line of code we write.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0414] via-transparent to-transparent z-10"></div>
              </div>
              
              <div className="p-6 relative z-20 -mt-8">
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-semibold mb-4">{member.role}</p>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed min-h-[60px]">
                  {member.bio}
                </p>
                
                <div className="flex gap-4 border-t border-white/10 pt-4">
                  <a href={member.socials.linkedin} className="text-gray-500 hover:text-white transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href={member.socials.github} className="text-gray-500 hover:text-white transition-colors">
                    <Github size={18} />
                  </a>
                  <a href={member.socials.twitter} className="text-gray-500 hover:text-white transition-colors">
                    <Twitter size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
