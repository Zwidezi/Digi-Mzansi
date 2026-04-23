import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Filter, 
  Package, 
  AlertTriangle, 
  ChevronRight, 
  X, 
  Loader2,
  Tag,
  DollarSign,
  Layers
} from 'lucide-react';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import PremiumHeader from '../components/shared/PremiumHeader';

const Inventory = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Bakery'
  });
  const [adding, setAdding] = useState(false);

  // Real-time listener for current user's inventory
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'inventory'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setProducts(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setAdding(true);
      await addDoc(collection(db, 'inventory'), {
        ...newProduct,
        userId: user.uid,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        createdAt: serverTimestamp(),
        status: parseInt(newProduct.stock) === 0 ? 'Out' : 
                parseInt(newProduct.stock) < 5 ? 'Low' : 'Healthy'
      });
      
      setShowAddModal(false);
      setNewProduct({ name: '', price: '', stock: '', category: 'Bakery' });
    } catch (err) {
      console.error("Error adding product", err);
    } finally {
      setAdding(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24">
      <PremiumHeader title="Stock" />
      
      <div className="px-6 pb-4">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Stock Control</p>
        <h2 className="text-4xl font-black text-white tracking-tighter">Inventory</h2>
      </div>

      <div className="px-6">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="px-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 card-dark border-dashed border-2 m-4">
            <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 font-bold text-sm">No products found.</p>
            <p className="text-white/20 text-[10px] uppercase mt-1">Tap + to add your first item</p>
          </div>
        ) : (
          filteredProducts.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 5 }}
              className="card-dark p-6 flex items-center justify-between border-white/5"
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.stock === 0 ? 'bg-danger/20 text-danger' : 
                  item.stock < 5 ? 'bg-primary/20 text-primary' : 
                  'bg-success/20 text-success'
                }`}>
                  {item.stock > 0 ? <Package className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                
                <div>
                  <h3 className="font-bold text-white text-sm">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-black uppercase ${
                      item.stock === 0 ? 'text-danger' : 
                      item.stock < 5 ? 'text-primary' : 
                      'text-success'
                    }`}>
                      {item.stock} in stock
                    </span>
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{item.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-black text-white text-sm">R {parseFloat(item.price).toFixed(2)}</p>
                <ChevronRight className="w-4 h-4 text-white/10 ml-auto mt-1" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <div className="px-6 pt-4">
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full py-5 btn-glow flex items-center justify-center gap-3"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">Add New Product</span>
        </button>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-[#0A0D14] rounded-t-[2.5rem] p-10 space-y-8 border-t border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">Add Product</h3>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-6 h-6 text-white/20" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Product Name</label>
                  <div className="relative">
                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input 
                      required
                      type="text" 
                      className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                      placeholder="e.g. White Bread"
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Price (R)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Stock Qty</label>
                    <div className="relative">
                      <Layers className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <input 
                        required
                        type="number" 
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={adding}
                  className="w-full py-6 btn-glow flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {adding ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Save to Inventory</span>
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

export default Inventory;
