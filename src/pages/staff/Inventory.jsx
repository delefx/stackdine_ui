import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StaffLayout from '../../components/StaffLayout';
import API from '../../api/axios';

const RestockModal = ({ item, onClose, onSaved }) => {
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.patch(`/inventory/${item._id}/restock`, {
        quantity: Number(quantity),
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">Restock {item.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <div className="mb-4 bg-gray-800 rounded-lg px-4 py-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Current stock</span>
            <span className={item.isLowStock ? 'text-red-400 font-semibold' : 'text-white'}>
              {item.quantity} {item.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Reorder point</span>
            <span className="text-white">{item.reorderPoint} {item.unit}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Quantity to add ({item.unit})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Restocking...' : 'Restock'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const StaffInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRestock, setShowRestock] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);

  const categories = ['ingredient', 'beverage', 'packaging', 'equipment', 'other'];

  const fetchItems = async () => {
    try {
      const { data } = await API.get('/inventory');
      setItems(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const lowStockCount = items.filter((i) => i.isLowStock).length;

  const filtered = items
    .filter((i) => filterCategory === 'all' || i.category === filterCategory)
    .filter((i) => !showLowStock || i.isLowStock);

  return (
    <StaffLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Inventory</h2>
          <p className="text-gray-400 text-sm mt-1">{items.length} items total</p>
        </div>

        {lowStockCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center justify-between"
          >
            <p className="text-red-400 text-sm">
              ⚠️ {lowStockCount} item(s) are running low on stock
            </p>
            <button
              onClick={() => setShowLowStock(!showLowStock)}
              className="text-red-400 text-xs underline"
            >
              {showLowStock ? 'Show all' : 'Show only low stock'}
            </button>
          </motion.div>
        )}

        <div className="flex gap-2 flex-wrap">
          {['all', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${
                filterCategory === c
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Name</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Category</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Quantity</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Reorder Point</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Supplier</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Status</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 py-8 text-sm">
                        No inventory items found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-800/50 transition"
                      >
                        <td className="px-6 py-4 text-white text-sm font-medium">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm capitalize">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={item.isLowStock ? 'text-red-400 font-semibold' : 'text-white'}>
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {item.reorderPoint} {item.unit}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {item.supplier?.name || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.isLowStock
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {item.isLowStock ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowRestock(true);
                            }}
                            className="text-xs text-green-400 hover:text-green-300 transition"
                          >
                            Restock
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showRestock && selectedItem && (
            <RestockModal
              item={selectedItem}
              onClose={() => setShowRestock(false)}
              onSaved={fetchItems}
            />
          )}
        </AnimatePresence>
      </div>
    </StaffLayout>
  );
};

export default StaffInventory;