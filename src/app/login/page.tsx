"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Cpu, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const ADMIN_EMAILS = ["admin@roboonbd.com", "roboonbd@gmail.com"];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified && !ADMIN_EMAILS.includes(user.email || "")) {
          await signOut(auth);
          setError("Your email is not verified. Please check your inbox and click the verification link before signing in.");
          setLoading(false);
          return;
        }
        
        // Route based on role/email
        if (ADMIN_EMAILS.includes(user.email || "")) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Sign Up Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile display name
        await updateProfile(user, { displayName: `${firstName} ${lastName}` });

        // Save extra user details to Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          firstName,
          lastName,
          email,
          whatsapp,
          address,
          role: ADMIN_EMAILS.includes(user.email || "") ? "admin" : "student",
          createdAt: new Date().toISOString()
        });

        // Send Email Verification
        await sendEmailVerification(user);
        
        // Force sign out after registration
        await signOut(auth);
        
        setSuccessMsg(`Success! A verification link has been sent to ${email}. Please verify your account through your email before signing in.`);
        setIsLogin(true); // Switch to login view so they can sign in after verifying
      }
    } catch (err: any) {
      if (err.code === "auth/configuration-not-found" || err.message.includes("configuration-not-found")) {
         setError("Critical Error: Firebase is not configured properly. If you just added the configuration, you MUST restart the development server (Ctrl+C, then npm run dev).");
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
         setError("Wrong User ID or Password. Please check your credentials or create an account.");
      } else {
         setError(err.message || "Authentication failed. Please check your details.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overscroll-none pt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full -z-10 pointer-events-none transform-gpu" style={{ background: 'radial-gradient(circle, rgba(60,179,150,0.15) 0%, rgba(60,179,150,0) 70%)' }} />
      
      <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/5 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-4 border border-primary/20">
            <img 
              src="/robo-on-website/logo.png" 
              alt="RoboON Icon" 
              className="w-10 h-10 object-contain brightness-0 invert opacity-90" 
            />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            {isLogin ? "Enter your credentials to access your portal." : "Join RoboON to access courses and resources."}
          </p>
        </div>

        {/* Toggle Login/Signup */}
        <div className="flex bg-black/40 rounded-xl p-1 mb-8">
          <button 
            type="button" 
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Sign In
          </button>
          <button 
            type="button" 
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-secondary/20 border border-primary/30 rounded-xl flex items-start gap-3 text-white">
            <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-primary" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={!isLogin}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={!isLogin}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600"
                  placeholder="Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600"
              placeholder="user@example.com"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required={!isLogin}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600"
                  placeholder="+880 1XXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required={!isLogin}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600"
                  placeholder="Street, City, Country"
                />
              </div>
            </>
          )}
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              {isLogin && <a href="#" className="text-xs text-primary hover:text-white transition-colors">Forgot password?</a>}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-white hover:text-black transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(60,179,150,0.3)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Create Account")}
          </button>

          {isLogin && (
            <p className="text-center text-sm text-gray-400 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-primary font-semibold hover:underline"
              >
                Create one
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
