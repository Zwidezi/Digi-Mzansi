import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  Zap, 
  Info, 
  Wallet,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { db } from '../firebase/config';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  increment,
  doc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import PremiumHeader from '../components/shared/PremiumHeader';

const Marketplace = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [buying, setBuying] = useState(false);

  const categories = ['All', 'Wholesale', 'Beverages', 'Bakery', 'Electronics', 'Fresh'];

  useEffect(() => {
    // Listen for real suppliers/deals
    const q = collection(db, 'marketplace');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setSuppliers(items.length > 0 ? items : [
        { id: 'm1', name: 'Makro Wholesale', rating: 4.9, delivery: 'Same Day', image: '🏪', verified: true, deals: 'Bulk Maize Meal R75', price: 75, item: 'Maize Meal 5kg' },
        { id: 'm2', name: 'Coca-Cola Distro', rating: 4.8, delivery: 'Tomorrow', image: '🥤', verified: true, deals: '24 x 500ml Case R180', price: 180, item: 'Full Cream Milk' }
      ]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePurchase = async () => {
    if (!user || !selectedDeal) return;
    
    try {
      setBuying(true);
      
      // 1. Record Transaction (Expense)
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        title: `Stock: ${selectedDeal.item}`,
        amount: selectedDeal.price,
        type: 'out',
        method: 'Marketplace',
        createdAt: serverTimestamp()
      });

      // 2. Add to Inventory
      // We'll search if the item already exists or create new
      // For MVP simplicity, we add as new or increment if name matches
      await addDoc(collection(db, 'inventory'), {
        userId: user.uid,
        name: selectedDeal.item,
        price: (selectedDeal.price / 10) * 1.2, // Auto-markup logic
        stock: 10,
        category: 'Wholesale',
        createdAt: serverTimestamp()
      });

      setShowCheckout(false);
      alert(`Success! ${selectedDeal.item} added to your stock.`);
    } catch (err) {
      console.error("Purchase failed", err);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <PremiumHeader title="Market" />

      <div className="flex justify-between items-end px-6">
        <div>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Procurement</p>
          <h2 className="text-4xl font-black text-white tracking-tighter">Market</h2>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center shadow-lg relative"
        >
          <ShoppingCart className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Category Scroll */}
      <div className="flex gap-3 overflow-x-auto px-6 py-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              category === cat 
              ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,100,0,0.3)]' 
              : 'bg-white/5 text-white/40 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Supplier Grid */}
      <div className="space-y-6 px-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : (
          suppliers.map((supplier) => (
            <motion.div
              key={supplier.id}
              whileHover={{ scale: 1.02 }}
              className="card-dark overflow-hidden group cursor-pointer border-white/5"
              onClick={() => {
                setSelectedDeal(supplier);
                setShowCheckout(true);
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">
                    {supplier.image}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-white text-lg">{supplier.name}</h3>
                      {supplier.verified && <ShieldCheck className="w-4 h-4 text-success" />}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-[10px] font-black text-white">{supplier.rating}</span>
                      </div>
                      <span className="text-white/10 text-xs">•</span>
                      <span className="text-[10px] font-black text-white/40 uppercase">{supplier.delivery}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex justify-between items-center group-hover:bg-primary/20 transition-all">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{supplier.deals}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && selectedDeal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-end"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="w-full bg-[#0A0D14] rounded-t-[3rem] p-10 space-y-8 border-t border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-white">Order Summary</h3>
                <p className="text-white/40 text-sm font-medium">{selectedDeal.name}</p>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-white/40">Product</span>
                  <span className="text-white">{selectedDeal.item} x 10</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-4 border-t border-white/5">
                  <span className="text-white/40">Total</span>
                  <span className="text-primary">R {selectedDeal.price.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handlePurchase}
                disabled={buying}
                className="w-full py-6 btn-glow flex items-center justify-center gap-3"
              >
                {buying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm & Pay</span>
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;
