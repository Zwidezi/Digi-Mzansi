import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Store, CreditCard, Package, ShieldCheck, Wallet, LogOut, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Package, label: 'Stock', path: '/inventory' },
    { icon: CreditCard, label: 'Pay', path: '/payments' },
    { icon: Wallet, label: 'Finance', path: '/finance' },
    { icon: Store, label: 'Market', path: '/market' },
  ];

  return (
    <div className="mobile-viewport min-h-[100dvh] flex flex-col bg-bg-deep overflow-hidden">
      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto custom-scrollbar pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Integrated Dark Bottom Navigation - Full Width for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#07090D]/80 backdrop-blur-2xl border-t border-white/5 px-2 py-3 flex justify-around items-center z-40 safe-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center group py-1 flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                className={`p-2 transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-white/20'
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_hsla(var(--primary),0.5)]' : ''}`} />
              </motion.div>
              <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${
                isActive ? 'text-primary' : 'text-white/10'
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
