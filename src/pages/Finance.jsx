import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  ArrowUpRight, 
  Wallet,
  Activity,
  History,
  Lock,
  Loader2
} from 'lucide-react';
import { db } from '../firebase/config';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where,
  getDocs
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import PremiumHeader from '../components/shared/PremiumHeader';

const Finance = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    trustScore: 450,
    creditLimit: 0,
    status: 'Growing'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen for business profile
    const unsubProfile = onSnapshot(doc(db, 'businessProfiles', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setStats(prev => ({ ...prev, ...docSnap.data() }));
      }
    });

    // Dynamic Score Calculation (Simplistic for MVP)
    const calculateHealth = async () => {
      const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const txCount = snap.size;
      
      // Every transaction adds to the trust score
      const newScore = 450 + (txCount * 10);
      const newLimit = txCount > 5 ? 5000 : 0;
      
      setStats(prev => ({
        ...prev,
        trustScore: Math.min(newScore, 850),
        creditLimit: newLimit,
        status: newScore > 600 ? 'Excellent' : 'Growing'
      }));
      setLoading(false);
    };

    calculateHealth();
    return () => unsubProfile();
  }, [user]);

  return (
    <div className="space-y-10 pb-24 px-2">
      <PremiumHeader title="Credit" />
      
      <header className="px-4">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Financial Health</p>
        <h2 className="text-4xl font-black text-white tracking-tighter">Biz Credit</h2>
      </header>

      {/* Dynamic Credit Score Ring */}
      <section className="flex flex-col items-center justify-center pt-6 pb-2">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="128" cy="128" r="110" fill="none" stroke="#1A1C23" strokeWidth="20" />
            <motion.circle 
              cx="128" cy="128" r="110" fill="none" stroke="hsl(var(--primary))" strokeWidth="20" 
              strokeDasharray="690.8"
              initial={{ strokeDashoffset: 690.8 }}
              animate={{ strokeDashoffset: 690.8 * (1 - (stats.trustScore / 850)) }}
              transition={{ duration: 2, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          
          <div className="text-center z-10 space-y-1">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Trust Score</p>
            <h3 className="text-6xl font-black tracking-tighter text-white">{stats.trustScore}</h3>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{stats.status}</p>
          </div>
        </div>
      </section>

      {/* Real Credit Offers */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-6">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Offers</p>
          <Activity className="w-4 h-4 text-white/10" />
        </div>

        <div className="space-y-4 px-4">
          <motion.div whileHover={{ y: -5 }} className="card-dark p-6 flex items-center justify-between border-white/5">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-white text-base">R {stats.creditLimit.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-white/20 uppercase">Stock Up Credit</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                stats.creditLimit > 0 ? 'bg-success/20 text-success' : 'bg-white/5 text-white/20'
              }`}>
                {stats.creditLimit > 0 ? 'Available' : 'Locked'}
              </span>
              <ChevronRight className="w-5 h-5 text-white/10" />
            </div>
          </motion.div>

          <div className="card-dark p-8 bg-white/5 border-dashed border-2 border-white/5 flex flex-col items-center text-center">
            <Lock className="w-8 h-8 text-white/10 mb-3" />
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Asset Finance (Locked)</p>
            <p className="text-[9px] text-white/10 mt-1">Reach 100 Transactions to unlock</p>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="px-4 pb-10">
        <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-[0_20px_40px_rgba(255,100,0,0.2)]">
          <div className="relative z-10">
            <h4 className="text-xl font-black mb-1 leading-tight">Boost Your Score</h4>
            <p className="text-white/60 text-xs font-medium mb-6">Process all your supplier orders through the Marketplace to verify your turnover.</p>
            <button className="w-full py-4 bg-white text-secondary rounded-2xl font-black text-xs uppercase tracking-widest">
              View Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Finance;
