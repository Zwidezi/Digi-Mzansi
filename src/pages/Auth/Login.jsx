import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-viewport bg-white flex flex-col items-center px-10 py-20 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-12"
      >
        <h2 className="text-4xl font-extrabold text-[#1A1C1E] text-center tracking-tight">Sign In</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-xs font-bold border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Field */}
          <div className="space-y-2">
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
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1A1C1E] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 outline-none focus:border-[#0066FF] transition-all font-medium text-gray-700 bg-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0066FF] py-4 rounded-xl text-white font-black text-lg shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="text-center space-y-4">
          <button className="text-[#0066FF] font-bold text-sm hover:underline">
            Forgot Password?
          </button>
          <p className="text-gray-400 text-sm font-medium pt-4">
            New here?{' '}
            <Link to="/signup" className="text-[#0066FF] font-black hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
