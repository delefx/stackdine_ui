import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerLayout from '../../components/CustomerLayout';
import API from '../../api/axios';

const categories = ['all', 'starter', 'main', 'dessert', 'drink', 'side'];

const CartItem = ({ item, quantity, onIncrease, onDecrease }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex-1">
      <p className="text-white text-sm font-medium">{item.name}</p>
      <p className="text-orange-400 text-xs">₦{(item.price * quantity).toLocaleString()}</p>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onDecrease(item._id)}
        className="w-7 h-7 rounded-full bg-gray-700 text-white text-sm flex items-center justify-center hover:bg-gray-600 transition"
      >
        -
      </button>
      <span className="text-white text-sm w-4 text-center">{quantity}</span>
      <button
        onClick={() => onIncrease(item)}
        className="w-7 h-7 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center hover:bg-orange-600 transition"
      >
        +
      </button>
    </div>
  </div>
);

const OrderModal = ({ cart, onClose, onOrdered }) => {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({
    orderType: 'dine-in',
    tableId: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { data } = await API.get('/tables/available');
        setTables(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTables();
  }, []);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const items = cart.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
        customization: item.customization || '',
      }));

      await API.post('/orders', {
        items,
        orderType: form.orderType,
        tableId: form.orderType === 'dine-in' ? form.tableId : null,
        note: form.note,
      });

      onOrdered();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
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
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Place Order</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Order summary */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4 space-y-2">
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span className="text-gray-300">{item.name} x{item.quantity}</span>
              <span className="text-orange-400">
                ₦{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold">
            <span className="text-white">Total</span>
            <span className="text-orange-400">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Order Type</label>
            <select
              value={form.orderType}
              onChange={(e) => setForm({ ...form, orderType: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="dine-in">Dine In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {form.orderType === 'dine-in' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Select Table</label>
              <select
                value={form.tableId}
                onChange={(e) => setForm({ ...form, tableId: e.target.value })}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              >
                <option value="">Select a table</option>
                {tables.map((t) => (
                  <option key={t._id} value={t._id}>
                    Table {t.tableNumber} (capacity: {t.capacity})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Special Note (optional)
            </label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={2}
              placeholder="Any special requests..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm resize-none"
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
              {loading ? 'Placing...' : `Order ₦${totalAmount.toLocaleString()}`}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CustomerMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await API.get('/menu?isAvailable=true');
        setItems(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decreaseCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((c) => c._id === id);
      if (existing.quantity === 1) {
        return prev.filter((c) => c._id !== id);
      }
      return prev.map((c) =>
        c._id === id ? { ...c, quantity: c.quantity - 1 } : c
      );
    });
  };

  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const filtered = items
    .filter((i) => filterCategory === 'all' || i.category === filterCategory)
    .filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Menu</h2>
          {cart.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCart(!showCart)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              🛒 Cart ({cartCount}) · ₦{cartTotal.toLocaleString()}
            </motion.button>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 text-white border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 text-sm"
        />

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition capitalize whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cart panel */}
        <AnimatePresence>
          {showCart && cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-900 rounded-2xl border border-orange-500/30 p-4"
            >
              <h3 className="text-white font-semibold mb-3">Your Cart</h3>
              <div className="divide-y divide-gray-800">
                {cart.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    quantity={item.quantity}
                    onIncrease={addToCart}
                    onDecrease={decreaseCart}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                <span className="text-white font-semibold">
                  Total: ₦{cartTotal.toLocaleString()}
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOrder(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Place Order
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success message */}
        <AnimatePresence>
          {ordered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm"
            >
              Order placed successfully! 🎉 Track it in My Orders.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu grid */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((item, i) => {
                const cartItem = cart.find((c) => c._id === item._id);
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
                  >
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.name}
                        className="w-full h-36 object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 bg-gray-800 flex items-center justify-center text-4xl">
                        🍽️
                      </div>
                    )}
                    <div className="p-3">
                      <h4 className="text-white text-sm font-semibold truncate">
                        {item.name}
                      </h4>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-orange-400 font-bold text-sm">
                          ₦{item.price?.toLocaleString()}
                        </span>
                        {cartItem ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => decreaseCart(item._id)}
                              className="w-6 h-6 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-white text-xs w-3 text-center">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToCart(item)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                          >
                            Add
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {showOrder && (
            <OrderModal
              cart={cart}
              onClose={() => setShowOrder(false)}
              onOrdered={() => {
                setCart([]);
                setShowCart(false);
                setOrdered(true);
                setTimeout(() => setOrdered(false), 4000);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </CustomerLayout>
  );
};

export default CustomerMenu;