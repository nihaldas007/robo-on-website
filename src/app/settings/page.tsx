"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { KeyRound, MessageSquare, Shield, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function SettingsPage() {
  const [resetSent, setResetSent] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordReset = async () => {
    if (!auth.currentUser?.email) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://formsubmit.co/ajax/roboonbd@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          "_subject": "New Feedback: RoboON Dashboard",
          "User Email": auth.currentUser?.email || "Anonymous",
          "Message": feedback,
          "_template": "table",
          "_captcha": "false"
        }),
      });

      if (response.ok) {
        setFeedbackSent(true);
        setFeedback("");
        setTimeout(() => setFeedbackSent(false), 5000);
      } else {
        setError("Failed to send feedback. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full transform-gpu" style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, rgba(22,163,74,0) 70%)' }} />
          <div className="absolute bottom-40 left-0 w-[300px] h-[300px] rounded-full transform-gpu" style={{ background: 'radial-gradient(circle, rgba(41,42,58,0.3) 0%, rgba(41,42,58,0) 70%)' }} />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <Link href="/dashboard" className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Password Reset Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl border border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <KeyRound size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Security & Password</h2>
                  <p className="text-sm text-gray-400">Manage your login credentials safely.</p>
                </div>
              </div>
              
              <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                <p className="text-sm text-gray-300 mb-6 font-medium">
                  Need to change your password? We will send a secure reset link to your registered email address.
                </p>
                
                {resetSent ? (
                  <div className="flex items-center gap-3 text-primary bg-primary/10 p-4 rounded-xl border border-primary/20">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-bold">Reset link sent! Please check your Gmail.</span>
                  </div>
                ) : (
                  <button 
                    onClick={handlePasswordReset}
                    disabled={loading}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Password Reset Link"}
                  </button>
                )}
              </div>
            </motion.section>

            {/* Feedback Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-3xl border border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Feedback</h2>
                  <p className="text-sm text-gray-400">Tell us how we can improve your learning experience.</p>
                </div>
              </div>

              <form onSubmit={handleFeedback} className="space-y-4">
                <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts or report an issue..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:border-primary/50 outline-none transition-all min-h-[150px] text-sm"
                />
                
                <div className="flex justify-end">
                  {feedbackSent ? (
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <CheckCircle2 size={18} /> Thank you for your feedback!
                    </div>
                  ) : (
                    <button 
                      type="submit"
                      disabled={loading || !feedback.trim()}
                      className="px-8 py-3 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(22,163,74,0.2)] disabled:opacity-50 flex items-center gap-2"
                    >
                      Submit Feedback <Send size={18} />
                    </button>
                  )}
                </div>
              </form>
            </motion.section>

            {/* Privacy Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-3xl border border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Privacy & Safety</h2>
                  <p className="text-sm text-gray-400">Your data privacy is our top priority.</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-400 leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/5">
                <p>
                  At <span className="text-white font-bold">RoboON</span>, we ensure that your personal information and learning data are encrypted and never shared with third parties.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <Link href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>
                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                  <Link href="/terms" className="text-primary hover:underline font-semibold">Terms of Service</Link>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
