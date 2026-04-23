import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const PremiumHeader = ({ title = "Mzansi Biz" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-bg-deep/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,100,0,0.3)] cursor-pointer">
            <Store className="text-white w-5 h-5" />
          </div>
          <h1 className="font-black text-lg tracking-tight text-white uppercase cursor-pointer">{title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-1 hidden xs:flex">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Owner</p>
            <p className="text-xs font-bold text-white leading-none">
              {user?.displayName || 'Merchant'}
            </p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/registration')}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-white/40 hover:text-white transition-colors"
          >
            <User className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center border border-danger/20 text-danger hover:bg-danger/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PremiumHeader;
