import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/axios';

const AdminAnalytics = () => {
  const [sales, setSales] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [menuPopularity, setMenuPopularity] = useState([]);
  const [customerStats, setCustomerStats] = useState(null);
  const [reservationStats, setReservationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = dateRange.startDate && dateRange.endDate
        ? `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        : '';

      const [salesRes, orderRes, menuRes, customerRes, reservationRes] =
        await Promise.all([
          API.get(`/analytics/sales${params}`),
          API.get(`/analytics/orders${params}`),
          API.get(`/analytics/menu-popularity${params}`),
          API.get('/analytics/customers'),
          API.get('/analytics/reservations'),
        ]);

      setSales(salesRes.data.data);
      setOrderStats(orderRes.data.data);
      setMenuPopularity(menuRes.data.data);
      setCustomerStats(customerRes.data.data);
      setReservationStats(reservationRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Analytics</h2>
            <p className="text-gray-400 text-sm mt-1">
              Business performance overview
            </p>
          </div>
          {/* Date range filter */}
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchAnalytics}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Apply
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Sales summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Revenue',
                  value: `₦${sales?.totalRevenue?.toLocaleString() || 0}`,
                  color: 'text-orange-400',
                },
                {
                  label: 'Total Orders',
                  value: sales?.totalOrders || 0,
                  color: 'text-blue-400',
                },
                {
                  label: 'Avg Order Value',
                  value: `₦${Math.round(sales?.averageOrderValue || 0).toLocaleString()}`,
                  color: 'text-green-400',
                },
                {
                  label: 'Total Customers',
                  value: customerStats?.totalCustomers || 0,
                  color: 'text-purple-400',
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
                >
                  <p className="text-gray-400 text-sm">{card.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${card.color}`}>{card.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Daily sales */}
            {sales?.dailySales?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-800">
                  <h3 className="text-white font-semibold">Daily Sales</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-gray-400 text-sm px-6 py-3 font-medium">Date</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-3 font-medium">Orders</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-3 font-medium">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {sales.dailySales.map((day, i) => (
                        <tr key={i} className="hover:bg-gray-800/50 transition">
                          <td className="px-6 py-3 text-white text-sm">{day._id}</td>
                          <td className="px-6 py-3 text-gray-400 text-sm">{day.orderCount}</td>
                          <td className="px-6 py-3 text-orange-400 text-sm font-semibold">
                            ₦{day.totalSales?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Orders by status */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-800">
                  <h3 className="text-white font-semibold">Orders by Status</h3>
                </div>
                <div className="divide-y divide-gray-800">
                  {orderStats?.ordersByStatus?.map((s, i) => (
                    <div key={i} className="px-6 py-3 flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{s._id}</span>
                      <span className="text-white font-semibold">{s.count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Orders by type */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-800">
                  <h3 className="text-white font-semibold">Orders by Type</h3>
                </div>
                <div className="divide-y divide-gray-800">
                  {orderStats?.ordersByType?.map((t, i) => (
                    <div key={i} className="px-6 py-3 flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{t._id}</span>
                      <div className="text-right">
                        <p className="text-white font-semibold">{t.count} orders</p>
                        <p className="text-orange-400 text-xs">
                          ₦{t.totalRevenue?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Peak hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-800">
                  <h3 className="text-white font-semibold">Peak Hours</h3>
                </div>
                <div className="divide-y divide-gray-800">
                  {orderStats?.peakHours?.map((h, i) => (
                    <div key={i} className="px-6 py-3 flex justify-between text-sm">
                      <span className="text-gray-400">
                        {h._id}:00 — {h._id + 1}:00
                      </span>
                      <span className="text-white font-semibold">{h.count} orders</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Reservation stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-800">
                  <h3 className="text-white font-semibold">Reservations by Status</h3>
                </div>
                <div className="divide-y divide-gray-800">
                  {reservationStats?.reservationsByStatus?.length === 0 ? (
                    <p className="text-gray-500 text-sm px-6 py-4">No reservation data yet</p>
                  ) : (
                    reservationStats?.reservationsByStatus?.map((r, i) => (
                      <div key={i} className="px-6 py-3 flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{r._id}</span>
                        <span className="text-white font-semibold">{r.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Top menu items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="text-white font-semibold">Menu Popularity</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-400 text-sm px-6 py-3 font-medium">#</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-3 font-medium">Item</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-3 font-medium">Category</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-3 font-medium">Orders</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-3 font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {menuPopularity.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-500 py-6 text-sm">
                          No data yet
                        </td>
                      </tr>
                    ) : (
                      menuPopularity.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-800/50 transition">
                          <td className="px-6 py-3 text-orange-400 font-bold text-sm">#{i + 1}</td>
                          <td className="px-6 py-3 text-white text-sm">{item.name}</td>
                          <td className="px-6 py-3 text-gray-400 text-sm capitalize">{item.category}</td>
                          <td className="px-6 py-3 text-white text-sm">{item.totalOrdered}</td>
                          <td className="px-6 py-3 text-green-400 text-sm font-semibold">
                            ₦{item.totalRevenue?.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Customer growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="text-white font-semibold">Customer Growth</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-400 text-sm px-6 py-3 font-medium">Month</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-3 font-medium">New Customers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {customerStats?.customerGrowth?.map((g, i) => (
                      <tr key={i} className="hover:bg-gray-800/50 transition">
                        <td className="px-6 py-3 text-white text-sm">{g._id}</td>
                        <td className="px-6 py-3 text-purple-400 text-sm font-semibold">
                          {g.newCustomers}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;