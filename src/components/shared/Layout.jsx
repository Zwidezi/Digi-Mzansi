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
    <div className="mobile-viewport min-h-screen flex flex-col bg-bg-deep">
      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto custom-scrollbar pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Integrated Dark Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-[#07090D] border-t border-white/5 px-6 py-4 flex justify-between items-center z-40">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center group py-1"
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
