"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Send, CheckCircle2, Phone, Lightbulb, User, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formsubmit.co/ajax/roboonbd@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...data, 
          "_subject": "New Project Proposal - Let's Build It Together",
          "_template": "table",
          "_captcha": "false"
        }),
      });

      if (response.ok) {
        setSent(true);
        setTimeout(() => setSent(false), 5000);
        (e.target as HTMLFormElement).reset();
      } else {
        setError("Failed to send your idea. Please try again or call us directly.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute top-0 right-0 w-full max-w-[500px] h-full max-h-[500px] rounded-full -z-10 transform-gpu" style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.1) 0%, rgba(22,163,74,0) 70%)' }} />
      <div className="absolute bottom-0 left-0 w-full max-w-[400px] h-full max-h-[400px] rounded-full -z-10 transform-gpu" style={{ background: 'radial-gradient(circle, rgba(41,42,58,0.2) 0%, rgba(41,42,58,0) 70%)' }} />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Let's Build It <span className="text-primary">Together</span>
          </h1>
        </div>

        <p className="text-gray-400 text-lg mb-12 max-w-2xl">
          Have a groundbreaking project idea? Whether it's Robotics, Embedded Systems, or custom Software, we're here to turn your vision into reality.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-3xl border border-white/10 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
                    <User size={16} /> Your Name
                  </label>
                  <input 
                    name="name"
                    required
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
                      <Mail size={16} /> Email Address
                    </label>
                    <input 
                      name="email"
                      required
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-primary/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
                      <Phone size={16} /> Contact Number
                    </label>
                    <input 
                      name="phone"
                      required
                      type="tel" 
                      placeholder="+880..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-primary/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
                    <Lightbulb size={16} /> Describe Your Project Idea
                  </label>
                  <textarea 
                    name="idea"
                    required
                    placeholder="Tell us what you want to build..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-primary/50 outline-none transition-all min-h-[150px]"
                  />
                </div>

                {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

                <div className="flex items-center justify-between">
                  {sent ? (
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <CheckCircle2 size={24} /> Sent Successfully!
                    </div>
                  ) : (
                    <button 
                      type="submit"
                      disabled={loading}
                      className="px-10 py-4 bg-primary text-black font-bold rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(22,163,74,0.3)] disabled:opacity-50 flex items-center gap-2 text-lg active:scale-95"
                    >
                      {loading ? "Sending..." : "Submit Proposal"} <Send size={20} />
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Contact Info Side */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-3xl border border-white/10 bg-primary/5"
            >
              <h3 className="text-xl font-bold text-white mb-6">Direct Contact</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="p-3 bg-white/5 rounded-xl text-primary"><Mail size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Email Us</p>
                    <p className="font-semibold text-sm md:text-base">roboonbd@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><Phone size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">WhatsApp</p>
                    <p className="font-semibold text-sm md:text-base">+880 1319-759370</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-3xl border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4">Why Build With Us?</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                  Expertise in Multi-disciplinary Engineering
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                  End-to-End Prototyping Capabilities
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                  Scalable Cloud & Software Integration
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
