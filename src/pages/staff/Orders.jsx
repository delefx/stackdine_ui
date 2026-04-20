import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StaffLayout from '../../components/StaffLayout';
import API from '../../api/axios';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  'in-progress': 'bg-purple-500/10 text-purple-400',
  ready: 'bg-teal-500/10 text-teal-400',
  delivered: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

const statusFlow = ['pending', 'confirmed', 'in-progress', 'ready', 'delivered'];

const OrderModal = ({ order, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (status) => {
    setLoading(true);
    try {
      await API.patch(`/orders/${order._id}/status`, { status });
      onUpdated();
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
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Order Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Customer</span>
            <span className="text-white">{order.customer?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Type</span>
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

          <div className="border-t border-gray-800 pt-4 space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div>
                  <span className="text-white">{item.menuItem?.name} x{item.quantity}</span>
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

          <div className="flex justify-between text-sm border-t border-gray-800 pt-4">
            <span className="text-gray-400">Total</span>
            <span className="text-orange-400 font-bold text-lg">
              ₦{order.totalAmount?.toLocaleString()}
            </span>
          </div>

          {order.note && (
            <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-400">
              Note: {order.note}
            </div>
          )}

          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="border-t border-gray-800 pt-4">
              <p className="text-gray-400 text-sm mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {statusFlow
                  .filter((s) => s !== order.status)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(s)}
                      disabled={loading}
                      className={`px-3 py-1.5 rounded-lg text-xs capitalize border transition ${statusColors[s]} border-current hover:opacity-80 disabled:opacity-50`}
                    >
                      {s}
                    </button>
                  ))}
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
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

  return (
    <StaffLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Orders</h2>
          <p className="text-gray-400 text-sm mt-1">{orders.length} total orders</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', ...statusFlow, 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${
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
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Customer</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Type</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Table</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Items</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Total</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Status</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Time</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-gray-500 py-8 text-sm">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-800/50 transition"
                      >
                        <td className="px-6 py-4 text-white text-sm">
                          {order.customer?.name}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm capitalize">
                          {order.orderType}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {order.table ? `Table ${order.table.tableNumber}` : '—'}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {order.items?.length}
                        </td>
                        <td className="px-6 py-4 text-orange-400 text-sm font-semibold">
                          ₦{order.totalAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelected(order)}
                            className="text-xs text-blue-400 hover:text-blue-300 transition"
                          >
                            View
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
          {selected && (
            <OrderModal
              order={selected}
              onClose={() => setSelected(null)}
              onUpdated={fetchOrders}
            />
          )}
        </AnimatePresence>
      </div>
    </StaffLayout>
  );
};

export default StaffOrders;