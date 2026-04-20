import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StaffLayout from '../../components/StaffLayout';
import API from '../../api/axios';

const statusColors = {
  pending: 'border-yellow-500/50 bg-yellow-500/5',
  confirmed: 'border-blue-500/50 bg-blue-500/5',
  'in-progress': 'border-purple-500/50 bg-purple-500/5',
  ready: 'border-green-500/50 bg-green-500/5',
};

const statusBadge = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  'in-progress': 'bg-purple-500/10 text-purple-400',
  ready: 'bg-green-500/10 text-green-400',
};

const nextStatus = {
  pending: 'confirmed',
  confirmed: 'in-progress',
  'in-progress': 'ready',
};

const nextStatusLabel = {
  pending: 'Confirm',
  confirmed: 'Start Cooking',
  'in-progress': 'Mark Ready',
};

const StaffKitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      const kitchenOrders = data.data.filter((o) =>
        ['pending', 'confirmed', 'in-progress', 'ready'].includes(o.status)
      );
      setOrders(kitchenOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await API.patch(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const columns = {
    pending: orders.filter((o) => o.status === 'pending'),
    confirmed: orders.filter((o) => o.status === 'confirmed'),
    'in-progress': orders.filter((o) => o.status === 'in-progress'),
    ready: orders.filter((o) => o.status === 'ready'),
  };

  const getElapsedTime = (createdAt) => {
    const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff === 1) return '1 min ago';
    return `${diff} mins ago`;
  };

  if (loading)
    return (
      <StaffLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div>
        </div>
      </StaffLayout>
    );

  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Kitchen Display</h2>
            <p className="text-gray-400 text-sm mt-1">
              {orders.length} active orders · Auto-refreshes every 30s
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchOrders}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition"
          >
            Refresh
          </motion.button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <p className="text-gray-400 text-lg font-medium">All caught up!</p>
            <p className="text-gray-600 text-sm mt-1">No active orders in the kitchen</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {Object.entries(columns).map(([status, columnOrders]) => (
              <div key={status} className="space-y-3">
                {/* Column header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold capitalize text-sm">
                    {status === 'in-progress' ? 'Cooking' : status}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[status]}`}>
                    {columnOrders.length}
                  </span>
                </div>

                {/* Order cards */}
                <AnimatePresence>
                  {columnOrders.length === 0 ? (
                    <div className="border border-dashed border-gray-800 rounded-xl p-4 text-center">
                      <p className="text-gray-600 text-xs">No orders</p>
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`rounded-xl border p-4 ${statusColors[status]}`}
                      >
                        {/* Order header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {order.customer?.name}
                            </p>
                            <p className="text-gray-500 text-xs mt-0.5 capitalize">
                              {order.orderType}
                              {order.table && ` · Table ${order.table.tableNumber}`}
                            </p>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {getElapsedTime(order.createdAt)}
                          </span>
                        </div>

                        {/* Items */}
                        <div className="space-y-1.5 mb-3">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-orange-400 text-xs font-bold mt-0.5">
                                x{item.quantity}
                              </span>
                              <div>
                                <p className="text-white text-xs">
                                  {item.menuItem?.name}
                                </p>
                                {item.customization && (
                                  <p className="text-gray-500 text-xs">
                                    {item.customization}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Note */}
                        {order.note && (
                          <div className="bg-black/20 rounded-lg px-3 py-2 mb-3">
                            <p className="text-gray-400 text-xs">📝 {order.note}</p>
                          </div>
                        )}

                        {/* Action button */}
                        {nextStatus[status] && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              handleStatusUpdate(order._id, nextStatus[status])
                            }
                            disabled={updating === order._id}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                          >
                            {updating === order._id
                              ? 'Updating...'
                              : nextStatusLabel[status]}
                          </motion.button>
                        )}

                        {status === 'ready' && (
                          <div className="w-full bg-green-500/20 text-green-400 py-2 rounded-lg text-xs font-semibold text-center">
                            Ready for pickup
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default StaffKitchen;