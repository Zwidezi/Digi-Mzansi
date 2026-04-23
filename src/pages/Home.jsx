import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  CreditCard, 
  Store, 
  ShieldCheck, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight, 
  Zap, 
  PlusCircle,
  BarChart3,
  Menu
} from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import PremiumHeader from '../components/shared/PremiumHeader';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === 'in') total += parseFloat(data.amount);
      });
      setRevenue(total);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const actions = [
    { icon: Package, label: 'Inventory', sub: 'Active Stock', path: '/inventory', color: 'text-orange-500' },
    { icon: CreditCard, label: 'Payments', sub: 'Live Ledger', path: '/payments', color: 'text-blue-500' },
    { icon: Store, label: 'Market', sub: 'Suppliers', path: '/market', color: 'text-emerald-500' },
    { icon: Wallet, label: 'Finance', sub: 'Credit Lvl 1', path: '/finance', color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6 pb-24">
      <PremiumHeader />

      {/* Status Bar */}
      <div className="status-bar">
        Active Trading • Market Open
      </div>

      {/* Main Revenue Card */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark p-8 border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-2 right-4 text-[10px] font-black text-white/20 uppercase tracking-widest">Live Revenue</div>
          <div className="space-y-1">
            <p className="text-4xl font-black tracking-tighter text-white">
              R {revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-success uppercase">
              <TrendingUp className="w-3 h-3" /> Updated Just Now
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-8">
            <button 
              onClick={() => navigate('/payments', { state: { openSaleModal: true } })}
              className="py-4 btn-glow text-xs shadow-[0_10px_20px_-5px_rgba(255,100,0,0.3)]"
            >
              Record Sale
            </button>
            <button className="py-4 bg-white/5 text-white/60 rounded-2xl text-xs font-black uppercase border border-white/5">
              Insights
            </button>
          </div>
        </motion.div>
      </section>

      {/* Active Incident / Notification Style */}
      <section className="px-4">
        <div className="card-dark p-6 border-l-4 border-l-orange-500 space-y-4">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Procurement Alert</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="text-orange-500 w-5 h-5" />
              <p className="text-sm font-bold text-white/80">Stock Alert: White Bread is Low</p>
            </div>
            <div className="flex items-center gap-3">
              <PlusCircle className="text-orange-500 w-5 h-5" />
              <p className="text-sm font-bold text-white/80">Bulk Discount: Makro (Sandton)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Grid */}
      <section className="px-6 grid grid-cols-2 gap-6">
        {actions.map((item) => (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(item.path)}
            className="card-dark p-6 flex flex-col items-start gap-4 border-white/5 min-h-[140px]"
          >
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-black text-xs text-white uppercase tracking-wider">{item.label}</p>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">{item.sub}</p>
            </div>
          </motion.button>
        ))}
      </section>

      {/* Main CTA Button - Slide to Alert Style */}
      <section className="px-6 pb-12">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/payments')}
          className="w-full py-6 btn-glow flex items-center justify-center gap-4 text-sm"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ArrowUpRight className="text-white w-6 h-6" />
          </div>
          <span>Verify Live Activity</span>
          <ChevronRight className="w-5 h-5 opacity-50" />
        </motion.button>
      </section>
    </div>
  );
};

export default Home;
