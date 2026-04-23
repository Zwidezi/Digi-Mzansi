import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Store, 
  MapPin, 
  User, 
  FileCheck, 
  Camera, 
  ArrowRight, 
  ChevronLeft,
  Zap,
  Globe
} from 'lucide-react';

import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Registration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const checkProfile = async () => {
      const docSnap = await getDoc(doc(db, 'businessProfiles', user.uid));
      if (docSnap.exists()) {
        navigate('/');
      }
    };
    checkProfile();
  }, [user]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: user?.displayName || '',
    location: '',
    type: 'Spaza Shop'
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await setDoc(doc(db, 'businessProfiles', user.uid), {
        ...formData,
        userId: user.uid,
        trustScore: 450,
        createdAt: new Date().toISOString(),
        verified: true
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-10">
      <header className="px-2">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={prevStep} disabled={step === 1} className="p-1 disabled:opacity-0">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <p className="stat-label">Identity Setup</p>
        </div>
        <h2 className="text-hero text-3xl">Business <span className="text-orange-500">ID</span></h2>
      </header>

      {/* Premium Digital ID Card Visualization */}
      <section className="px-2 flex justify-center">
        <motion.div
          layout
          className="relative w-full h-[240px] rounded-[2.5rem] bg-secondary text-white p-8 shadow-2xl overflow-hidden preserve-3d"
          style={{
            perspective: '1000px'
          }}
        >
          {/* Holographic Mesh Effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]" />
          
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="stat-label text-white/30">Verified Entity</p>
                <h3 className="text-2xl font-black tracking-tight text-white leading-none">
                  {formData.businessName || 'Your Business Name'}
                </h3>
              </div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5 backdrop-blur-md">
                <Store className="text-orange-500 w-8 h-8" />
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-4">
                <div>
                  <p className="stat-label text-white/30 mb-0.5">Business Owner</p>
                  <p className="text-sm font-bold tracking-wide">{formData.ownerName || 'Owner Name'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-2 py-0.5 bg-accent/20 rounded border border-accent/20">
                    <p className="text-[8px] font-black text-accent uppercase tracking-widest">Active</p>
                  </div>
                  <div className="px-2 py-0.5 bg-white/10 rounded border border-white/10">
                    <p className="text-[8px] font-black text-white/60 uppercase tracking-widest">Lvl 1 Trust</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="stat-label text-white/30 mb-0.5">ID Number</p>
                <p className="text-[10px] font-mono tracking-tighter text-white/60 uppercase">MBZ-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Multi-step Form */}
      <section className="px-2 space-y-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="stat-label ml-4 text-gray-500">What is your business called?</label>
                <div className="relative">
                  <Store className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    type="text" 
                    className="w-full pl-16 pr-6 py-5 rounded-[1.75rem] border border-gray-100 bg-white shadow-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm"
                    placeholder="e.g. Mzansi Corner Shop"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="stat-label ml-4 text-gray-500">Business Owner Name</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    type="text" 
                    className="w-full pl-16 pr-6 py-5 rounded-[1.75rem] border border-gray-100 bg-white shadow-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm"
                    placeholder="Full Name"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="btn-primary-elite w-full py-5 flex items-center justify-center gap-3 shadow-glow-primary"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="stat-label ml-4 text-gray-500">Business Location</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    type="text" 
                    className="w-full pl-16 pr-6 py-5 rounded-[1.75rem] border border-gray-100 bg-white shadow-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm"
                    placeholder="Street Address or Landmark"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="stat-label ml-4 text-gray-500">Business Category</label>
                <select 
                  className="w-full px-8 py-5 rounded-[1.75rem] border border-gray-100 bg-white shadow-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm appearance-none"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>Spaza Shop</option>
                  <option>Tavern</option>
                  <option>Hair Salon</option>
                  <option>Car Wash</option>
                  <option>Street Vendor</option>
                </select>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={loading || !formData.location}
                className="btn-primary-elite w-full py-5 flex items-center justify-center gap-3 shadow-glow-primary"
              >
                {loading ? 'Generating...' : 'Generate ID'} <FileCheck className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Compliance Notice */}
      <section className="px-2">
        <div className="card-elite p-6 bg-gray-50 flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm flex-shrink-0">
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="font-black text-xs text-secondary">Hassle-Free Registration</p>
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed mt-1">By generating your ID, we also prepare your basic documents for CIPC and municipality health clearances.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Registration;
