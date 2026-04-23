import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  Plus, 
  Smartphone,
  ChevronRight,
  TrendingUp,
  CreditCard,
  X,
  Loader2,
  DollarSign
} from 'lucide-react';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import PremiumHeader from '../components/shared/PremiumHeader';

const Payments = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  useEffect(() => {
    if (location.state?.openSaleModal) {
      setShowSaleModal(true);
    }
  }, [location]);
  const [balance, setBalance] = useState(0);
  
  // Transaction States
  const [newTx, setNewTx] = useState({
    title: '',
    amount: '',
    type: 'in', // 'in' or 'out'
    method: 'Quick Sale'
  });
  const [sendTx, setSendTx] = useState({
    recipient: '',
    amount: '',
    title: 'Sent Funds',
    type: 'out',
    method: 'Wallet Transfer'
  });
  const [scanTx, setScanTx] = useState({
    merchantId: '',
    amount: '',
    title: 'Store Payment',
    type: 'out',
    method: 'QR Scan'
  });
  
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      let total = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({ id: doc.id, ...data });
        if (data.type === 'in') total += parseFloat(data.amount);
        else total -= parseFloat(data.amount);
      });
      setTransactions(items);
      setBalance(total);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleRecordTx = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setAdding(true);
      await addDoc(collection(db, 'transactions'), {
        ...newTx,
        userId: user.uid,
        amount: parseFloat(newTx.amount),
        createdAt: serverTimestamp()
      });
      
      setShowSaleModal(false);
      setNewTx({ title: '', amount: '', type: 'in', method: 'Quick Sale' });
    } catch (err) {
      console.error("Error recording transaction", err);
    } finally {
      setAdding(false);
    }
  };

  const handleSendTx = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setAdding(true);
      await addDoc(collection(db, 'transactions'), {
        ...sendTx,
        userId: user.uid,
        amount: parseFloat(sendTx.amount),
        createdAt: serverTimestamp()
      });
      setShowSendModal(false);
      setSendTx({ recipient: '', amount: '', title: 'Sent Funds', type: 'out', method: 'Wallet Transfer' });
    } catch (err) {
      console.error("Error sending funds", err);
    } finally {
      setAdding(false);
    }
  };

  const handleScanTx = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setAdding(true);
      await addDoc(collection(db, 'transactions'), {
        ...scanTx,
        userId: user.uid,
        amount: parseFloat(scanTx.amount),
        createdAt: serverTimestamp()
      });
      setShowScanModal(false);
      setScanTx({ merchantId: '', amount: '', title: 'Store Payment', type: 'out', method: 'QR Scan' });
    } catch (err) {
      console.error("Error scanning payment", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <PremiumHeader title="Finance" />
      
      <div className="px-6">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Financial Hub</p>
        <h2 className="text-4xl font-black text-white tracking-tighter">Payments</h2>
      </div>

      {/* Digital Wallet - Real Data */}
      <section className="px-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative h-64 w-full rounded-[2.5rem] bg-[#0A0D14] p-10 text-white shadow-2xl overflow-hidden border border-white/5"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <CreditCard className="w-40 h-40" />
          </div>
          
          <div className="relative h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Available Balance</p>
                <div className="flex items-center gap-1 text-success text-[10px] font-black">
                  <TrendingUp className="w-3 h-3" /> LIVE
                </div>
              </div>
              <h3 className="text-5xl font-black tracking-tighter">
                R {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Business Account</p>
                <p className="font-bold text-sm">Verified Ledger</p>
              </div>
              <div className="w-12 h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                <Zap className="text-primary w-4 h-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Action Buttons */}
      <div className="px-6 grid grid-cols-3 gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSaleModal(true)}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 btn-glow rounded-2xl flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Record</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowScanModal(true)}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Scan</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSendModal(true)}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Send</span>
        </motion.button>
      </div>

      {/* Transactions Feed */}
      <section className="px-4 space-y-4">
        <div className="flex justify-between items-center px-2">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Activity History</p>
          <button className="text-[9px] font-black text-primary uppercase tracking-widest">See All</button>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-white/20 text-[10px] font-black uppercase tracking-widest">
              No transactions yet
            </div>
          ) : (
            transactions.map((tx) => (
              <motion.div
                key={tx.id}
                whileHover={{ x: 5 }}
                className="card-dark p-5 flex items-center justify-between border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'in' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                  }`}>
                    {tx.type === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{tx.title}</p>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                      {tx.method} • {tx.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <p className={`font-black text-sm ${tx.type === 'in' ? 'text-success' : 'text-danger'}`}>
                  {tx.type === 'in' ? '+' : '-'}R {parseFloat(tx.amount).toFixed(2)}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Record Transaction Modal */}
      <AnimatePresence>
        {showSaleModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end"
            onClick={() => setShowSaleModal(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-[#0A0D14] rounded-t-[2.5rem] p-10 space-y-8 border-t border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">Record Transaction</h3>
                <button onClick={() => setShowSaleModal(false)}>
                  <X className="w-6 h-6 text-white/20" />
                </button>
              </div>

              <form onSubmit={handleRecordTx} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Transaction Description</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                    placeholder="e.g. Bread & Milk Sale"
                    value={newTx.title}
                    onChange={e => setNewTx({...newTx, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Amount (R)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                        placeholder="0.00"
                        value={newTx.amount}
                        onChange={e => setNewTx({...newTx, amount: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Type</label>
                    <select 
                      className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm appearance-none"
                      value={newTx.type}
                      onChange={e => setNewTx({...newTx, type: e.target.value})}
                    >
                      <option value="in">Income (+)</option>
                      <option value="out">Expense (-)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={adding}
                  className="w-full py-6 btn-glow flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {adding ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Process Transaction</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Modal */}
      <AnimatePresence>
        {showScanModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end"
            onClick={() => setShowScanModal(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-[#0A0D14] rounded-t-[2.5rem] p-10 space-y-8 border-t border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">Scan to Pay</h3>
                <button onClick={() => setShowScanModal(false)}>
                  <X className="w-6 h-6 text-white/20" />
                </button>
              </div>

              {/* Fake QR Scanner Box */}
              <div className="w-full aspect-square bg-white/5 rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center relative overflow-hidden">
                 <motion.div 
                   animate={{ y: [0, 200, 0] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="absolute w-full h-1 bg-primary/50 shadow-[0_0_20px_rgba(255,100,0,1)] top-0"
                 />
                 <QrCode className="w-16 h-16 text-white/20 mb-4" />
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center px-8">Point camera at Mzansi Biz QR Code</p>
              </div>

              <form onSubmit={handleScanTx} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Merchant ID</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                      placeholder="e.g. SPX-123"
                      value={scanTx.merchantId}
                      onChange={e => setScanTx({...scanTx, merchantId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Amount (R)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                      placeholder="0.00"
                      value={scanTx.amount}
                      onChange={e => setScanTx({...scanTx, amount: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={adding}
                  className="w-full py-6 btn-glow flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {adding ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Confirm Payment</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send Modal */}
      <AnimatePresence>
        {showSendModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end"
            onClick={() => setShowSendModal(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-[#0A0D14] rounded-t-[2.5rem] p-10 space-y-8 border-t border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">Send Funds</h3>
                <button onClick={() => setShowSendModal(false)}>
                  <X className="w-6 h-6 text-white/20" />
                </button>
              </div>

              <form onSubmit={handleSendTx} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Recipient Number or ID</label>
                  <div className="relative">
                    <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input 
                      required
                      type="text" 
                      className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                      placeholder="082 123 4567"
                      value={sendTx.recipient}
                      onChange={e => setSendTx({...sendTx, recipient: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Amount (R)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                      placeholder="0.00"
                      value={sendTx.amount}
                      onChange={e => setSendTx({...sendTx, amount: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={adding}
                  className="w-full py-6 btn-glow flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {adding ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      <ArrowUpRight className="w-5 h-5" />
                      <span>Send Instantly</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
