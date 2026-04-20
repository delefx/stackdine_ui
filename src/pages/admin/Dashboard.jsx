import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/axios';

const StatCard = ({ title, value, subtitle, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
  >
    <p className="text-gray-400 text-sm">{title}</p>
    <h3 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h3>
    <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [customerStats, setCustomerStats] = useState(null);
  const [locationStats, setLocationStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, ordersRes, menuRes, customerRes, locationRes] =
          await Promise.all([
            API.get('/analytics/sales'),
            API.get('/orders'),
            API.get('/analytics/menu-popularity'),
            API.get('/analytics/customers'),
            API.get('/analytics/locations'),
          ]);
        setStats(salesRes.data.data);
        setRecentOrders(ordersRes.data.data.slice(0, 5));
        setPopularItems(menuRes.data.data.slice(0, 5));
        setCustomerStats(customerRes.data.data);
        setLocationStats(locationRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back — here's what's happening at StackDine
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`₦${stats?.totalRevenue?.toLocaleString() || 0}`}
            subtitle="All time"
            color="text-orange-400"
            delay={0}
          />
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            subtitle="All time"
            color="text-blue-400"
            delay={0.1}
          />
          <StatCard
            title="Avg Order Value"
            value={`₦${Math.round(stats?.averageOrderValue || 0).toLocaleString()}`}
            subtitle="Per order"
            color="text-green-400"
            delay={0.2}
          />
          <StatCard
            title="Total Customers"
            value={customerStats?.totalCustomers || 0}
            subtitle="Registered"
            color="text-purple-400"
            delay={0.3}
          />
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">Recent Orders</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-sm px-6 py-4">No orders yet</p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">
                        {order.customer?.name || 'Guest'}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {order.orderType} · {order.items?.length} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-400 text-sm font-semibold">
                        ₦{order.totalAmount?.toLocaleString()}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                          order.status === 'delivered'
                            ? 'bg-green-500/10 text-green-400'
                            : order.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : order.status === 'cancelled'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-blue-500/10 text-blue-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Popular menu items */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">Top Menu Items</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {popularItems.length === 0 ? (
                <p className="text-gray-500 text-sm px-6 py-4">No data yet</p>
              ) : (
                popularItems.map((item, index) => (
                  <div
                    key={item._id}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-orange-500 font-bold text-sm w-5">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-gray-500 text-xs">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm">{item.totalOrdered} orders</p>
                      <p className="text-green-400 text-xs">
                        ₦{item.totalRevenue?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">Top Customers</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {customerStats?.topCustomers?.length === 0 ? (
                <p className="text-gray-500 text-sm px-6 py-4">No data yet</p>
              ) : (
                customerStats?.topCustomers?.map((customer) => (
                  <div
                    key={customer._id}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-sm font-bold">
                        {customer.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {customer.user?.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {customer.loyaltyPoints} pts
                        </p>
                      </div>
                    </div>
                    <p className="text-green-400 text-sm font-semibold">
                      ₦{customer.totalSpent?.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Location overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">Location Overview</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {locationStats.length === 0 ? (
                <p className="text-gray-500 text-sm px-6 py-4">
                  No locations added yet
                </p>
              ) : (
                locationStats.map((loc) => (
                  <div
                    key={loc._id}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">
                        {loc.locationName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {loc.totalOrders} orders
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-400 text-sm font-semibold">
                        ₦{loc.totalRevenue?.toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Avg ₦{Math.round(loc.averageOrderValue)?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;