import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import PremiumHeader from '../components/shared/PremiumHeader';

const Compliance = () => {
  const requirements = [
    { id: 1, name: 'CIPC Registration', status: 'In Progress', icon: FileText, due: '12 May', color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 2, name: 'Tax Compliance (SARS)', status: 'Pending', icon: ShieldCheck, due: '30 June', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, name: 'Health & Safety Permit', status: 'Completed', icon: CheckCircle2, due: 'Done', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 4, name: 'Zoning Approval', status: 'Action Required', icon: AlertCircle, due: 'Urgent', color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-10 pb-24 px-2">
      <PremiumHeader title="Identity" />
      
      {/* Header Info */}
      <header className="px-4">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Regulatory Portal</p>
        <h2 className="text-4xl font-black text-white tracking-tighter">Compliance</h2>
      </header>

      {/* Premium Progress Section */}
      <section className="card-elite p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-4xl font-black text-secondary tracking-tighter">65%</p>
            <p className="stat-label">Total Progress</p>
          </div>
          <div className="text-right">
            <p className="font-black text-emerald-500 text-sm">Level 2</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Tier</p>
          </div>
        </div>

        <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-1">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
        </div>
        
        <p className="text-[10px] text-gray-400 font-medium mt-4 leading-relaxed">
          You are <span className="text-secondary font-bold">2 steps away</span> from being eligible for the Government Informal Trader Grant.
        </p>
      </section>

      {/* Requirements List */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <p className="stat-label">Requirements</p>
          <Info className="w-4 h-4 text-gray-300" />
        </div>

        <div className="space-y-4">
          {requirements.map((req) => (
            <motion.div
              key={req.id}
              whileHover={{ x: 5 }}
              className="card-elite p-6 flex items-center justify-between group"
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 ${req.bg} ${req.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <req.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-secondary text-base">{req.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className={`text-[10px] font-black uppercase ${
                      req.status === 'Completed' ? 'text-emerald-500' : 'text-gray-400'
                    }`}>
                      {req.status}
                    </p>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Due: {req.due}</p>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Professional Support Banner */}
      <section className="px-1">
        <div className="bg-secondary p-8 rounded-[2.5rem] text-white relative overflow-hidden flex items-center justify-between">
          <div className="absolute bottom-[-30px] right-[-30px] w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
          <div className="relative z-10 flex-1">
            <h4 className="font-black text-lg mb-1 leading-tight">Need help with SARS?</h4>
            <p className="text-white/40 text-xs font-medium mb-4">Book a free 15-min call with our tax experts.</p>
            <button className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-transform">
              Schedule Now <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="relative z-10 w-20 h-20 bg-white/5 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10">
            <Clock className="w-10 h-10 text-white/20" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Compliance;
