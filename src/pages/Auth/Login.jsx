import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, AlertCircle, Loader2, ChevronRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-viewport bg-[#05070A] flex flex-col items-center px-10 py-16 min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-12 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/5 shadow-2xl">
            <Store className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Welcome <span className="text-primary">Back</span></h2>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">Digitizing Township Trade</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-5 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase border border-red-500/20">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Access</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="email" 
                required
                className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                placeholder="merchant@mzansibiz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Secure Key</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="password" 
                required
                className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 btn-glow flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span className="text-sm">Enter Dashboard</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </>
            )}
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-[#05070A] px-4 text-white/20 font-black">Secure Entry</span>
          </div>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20">
          New Merchant?{' '}
          <Link to="/signup" className="text-primary hover:underline ml-1">
            Register Business
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
