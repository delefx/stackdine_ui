import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/axios';

const categories = ['ingredient', 'beverage', 'packaging', 'equipment', 'other'];
const units = ['kg', 'g', 'litre', 'ml', 'pieces', 'bottles', 'boxes'];

const InventoryModal = ({ item, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: item?.name || '',
    category: item?.category || 'ingredient',
    quantity: item?.quantity || '',
    unit: item?.unit || 'kg',
    reorderPoint: item?.reorderPoint || '',
    costPerUnit: item?.costPerUnit || '',
    supplier: {
      name: item?.supplier?.name || '',
      contact: item?.supplier?.contact || '',
      email: item?.supplier?.email || '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSupplierChange = (e) => {
    setForm({ ...form, supplier: { ...form.supplier, [e.target.name]: e.target.value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (item) {
        await API.put(`/inventory/${item._id}`, form);
      } else {
        await API.post('/inventory', form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">
            {item ? 'Edit Item' : 'Add Inventory Item'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Quantity</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              >
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Reorder Point</label>
              <input
                name="reorderPoint"
                type="number"
                value={form.reorderPoint}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cost Per Unit (₦)</label>
              <input
                name="costPerUnit"
                type="number"
                value={form.costPerUnit}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-400 text-sm mb-3">Supplier Info</p>
            <div className="space-y-3">
              <input
                name="name"
                value={form.supplier.name}
                onChange={handleSupplierChange}
                placeholder="Supplier name"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
              <input
                name="contact"
                value={form.supplier.contact}
                onChange={handleSupplierChange}
                placeholder="Phone number"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
              <input
                name="email"
                value={form.supplier.email}
                onChange={handleSupplierChange}
                placeholder="Email"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
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
              {loading ? 'Saving...' : 'Save Item'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const RestockModal = ({ item, onClose, onSaved }) => {
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.patch(`/inventory/${item._id}/restock`, { quantity: Number(quantity) });
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

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);

const fetchItems = async () => {
  try {
    const { data } = await API.get('/inventory');
    // handle both { data: [...] } and plain [...] response shapes
    setItems(Array.isArray(data) ? data : data.data ?? []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/inventory/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const lowStockCount = items.filter((i) => i.isLowStock).length;

  const filtered = items
    .filter((i) => filterCategory === 'all' || i.category === filterCategory)
    .filter((i) => !showLowStock || i.isLowStock);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Inventory</h2>
            <p className="text-gray-400 text-sm mt-1">{items.length} items total</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedItem(null); setShowModal(true); }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
          >
            + Add Item
          </motion.button>
        </div>

        {/* Low stock alert */}
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

        {/* Filter */}
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

        {/* Table */}
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
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Cost/Unit</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Supplier</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Status</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-gray-500 py-8 text-sm">
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
                        <td className="px-6 py-4 text-white text-sm font-medium">{item.name}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm capitalize">{item.category}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={item.isLowStock ? 'text-red-400 font-semibold' : 'text-white'}>
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {item.reorderPoint} {item.unit}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          ₦{item.costPerUnit?.toLocaleString()}
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setSelectedItem(item); setShowRestock(true); }}
                              className="text-xs text-green-400 hover:text-green-300 transition"
                            >
                              Restock
                            </button>
                            <button
                              onClick={() => { setSelectedItem(item); setShowModal(true); }}
                              className="text-xs text-blue-400 hover:text-blue-300 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-xs text-red-400 hover:text-red-300 transition"
                            >
                              Delete
                            </button>
                          </div>
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
          {showModal && (
            <InventoryModal
              item={selectedItem}
              onClose={() => setShowModal(false)}
              onSaved={fetchItems}
            />
          )}
          {showRestock && (
            <RestockModal
              item={selectedItem}
              onClose={() => setShowRestock(false)}
              onSaved={fetchItems}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;