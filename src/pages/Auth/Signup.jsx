import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { updateProfile } from 'firebase/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      navigate('/registration');
    } catch (err) {
      setError('Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-viewport bg-white flex flex-col items-center px-10 py-16 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-10"
      >
        <h2 className="text-4xl font-extrabold text-[#1A1C1E] text-center tracking-tight">Create Account</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-xs font-bold border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#1A1C1E] ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 outline-none focus:border-[#0066FF] transition-all font-medium text-gray-700 bg-white"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#1A1C1E] ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 outline-none focus:border-[#0066FF] transition-all font-medium text-gray-700 bg-white"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#1A1C1E] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 outline-none focus:border-[#0066FF] transition-all font-medium text-gray-700 bg-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0066FF] py-4 rounded-xl text-white font-black text-lg shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center mt-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-400 font-bold">Or</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-4">
          <button className="w-full py-4 border border-gray-200 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-gray-50">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span className="font-bold text-gray-700 text-sm">Sign up with Google</span>
          </button>
          <button className="w-full py-4 bg-black border border-black rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.702z"/>
            </svg>
            <span className="font-bold text-white text-sm">Sign up with Apple</span>
          </button>
        </div>

        <p className="text-center text-sm font-medium text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0066FF] font-black hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
