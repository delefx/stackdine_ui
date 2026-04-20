import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerLayout from '../../components/CustomerLayout';
import API from '../../api/axios';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  'in-progress': 'bg-purple-500/10 text-purple-400',
  ready: 'bg-teal-500/10 text-teal-400',
  delivered: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

const statusSteps = ['pending', 'confirmed', 'in-progress', 'ready', 'delivered'];

const OrderDetailModal = ({ order, onClose, onCancelled }) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setLoading(true);
    try {
      await API.patch(`/orders/${order._id}/cancel`);
      onCancelled();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Order Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          {/* Status tracker */}
          {order.status !== 'cancelled' && (
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-3">Order Progress</p>
              <div className="flex items-center gap-1">
                {statusSteps.map((s, i) => (
                  <div key={s} className="flex items-center gap-1 flex-1">
                    <div className={`h-2 flex-1 rounded-full transition-all ${
                      i <= currentStep ? 'bg-orange-500' : 'bg-gray-700'
                    }`} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {statusSteps.map((s, i) => (
                  <span key={s} className={`text-xs capitalize ${
                    i <= currentStep ? 'text-orange-400' : 'text-gray-600'
                  }`}>
                    {s === 'in-progress' ? 'cooking' : s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Order Type</span>
            <span className="text-white capitalize">{order.orderType}</span>
          </div>

          {order.table && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Table</span>
              <span className="text-white">Table {order.table.tableNumber}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Date</span>
            <span className="text-white">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Items */}
          <div className="border-t border-gray-800 pt-4 space-y-2">
            <p className="text-gray-400 text-sm">Items</p>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div>
                  <span className="text-white">
                    {item.menuItem?.name} x{item.quantity}
                  </span>
                  {item.customization && (
                    <p className="text-gray-500 text-xs">{item.customization}</p>
                  )}
                </div>
                <span className="text-orange-400">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {order.note && (
            <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-400">
              Note: {order.note}
            </div>
          )}

          <div className="flex justify-between text-sm border-t border-gray-800 pt-4">
            <span className="text-gray-400">Total</span>
            <span className="text-orange-400 font-bold text-lg">
              ₦{order.totalAmount?.toLocaleString()}
            </span>
          </div>

          {order.status === 'pending' && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 py-2.5 rounded-lg text-sm transition disabled:opacity-50"
            >
              {loading ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const activeOrders = orders.filter((o) =>
    ['pending', 'confirmed', 'in-progress', 'ready'].includes(o.status)
  );

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Orders</h2>
          <p className="text-gray-400 text-sm mt-1">
            {orders.length} total · {activeOrders.length} active
          </p>
        </div>

        {/* Active order alert */}
        {activeOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3"
          >
            <p className="text-orange-400 text-sm font-medium">
              🔥 You have {activeOrders.length} active order(s) in progress
            </p>
          </motion.div>
        )}

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', ...statusSteps, 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm transition capitalize whitespace-nowrap ${
                filterStatus === s
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-gray-400 font-medium">No orders yet</p>
            <p className="text-gray-600 text-sm mt-1">
              Browse the menu and place your first order!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelected(order)}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-4 cursor-pointer hover:border-gray-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="text-gray-500 text-xs capitalize">
                        {order.orderType}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {order.items?.slice(0, 2).map((item, i) => (
                        <p key={i} className="text-white text-sm">
                          {item.menuItem?.name} x{item.quantity}
                        </p>
                      ))}
                      {order.items?.length > 2 && (
                        <p className="text-gray-500 text-xs">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-orange-400 font-bold">
                      ₦{order.totalAmount?.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Progress bar for active orders */}
                {['pending', 'confirmed', 'in-progress', 'ready'].includes(order.status) && (
                  <div className="mt-3 flex gap-1">
                    {statusSteps.map((s, i) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full ${
                          i <= statusSteps.indexOf(order.status)
                            ? 'bg-orange-500'
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selected && (
            <OrderDetailModal
              order={selected}
              onClose={() => setSelected(null)}
              onCancelled={fetchOrders}
            />
          )}
        </AnimatePresence>
      </div>
    </CustomerLayout>
  );
};

export default CustomerOrders;