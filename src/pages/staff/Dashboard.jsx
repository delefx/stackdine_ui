import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StaffLayout from '../../components/StaffLayout';
import API from '../../api/axios';

const StatCard = ({ title, value, subtitle, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
  >
    <p className="text-gray-400 text-sm">{title}</p>
    <h3 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h3>
    <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
  </motion.div>
);

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, tablesRes, reservationsRes] = await Promise.all([
          API.get('/orders'),
          API.get('/tables'),
          API.get('/reservations'),
        ]);
        setOrders(ordersRes.data.data);
        setTables(tablesRes.data.data);
        setReservations(reservationsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeOrders = orders.filter((o) =>
    ['pending', 'confirmed', 'in-progress', 'ready'].includes(o.status)
  );
  const availableTables = tables.filter((t) => t.status === 'available');
  const occupiedTables = tables.filter((t) => t.status === 'occupied');
  const todayReservations = reservations.filter((r) => {
    const today = new Date().toDateString();
    return new Date(r.date).toDateString() === today;
  });

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
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Staff Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">
            Here's what needs your attention today
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Orders"
            value={activeOrders.length}
            subtitle="Needs attention"
            color="text-orange-400"
            delay={0}
          />
          <StatCard
            title="Available Tables"
            value={availableTables.length}
            subtitle={`${occupiedTables.length} occupied`}
            color="text-green-400"
            delay={0.1}
          />
          <StatCard
            title="Today's Reservations"
            value={todayReservations.length}
            subtitle="Scheduled today"
            color="text-blue-400"
            delay={0.2}
          />
          <StatCard
            title="Total Tables"
            value={tables.length}
            subtitle="In this location"
            color="text-purple-400"
            delay={0.3}
          />
        </div>

        {/* Active orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold">Active Orders</h3>
            <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full">
              {activeOrders.length} active
            </span>
          </div>
          <div className="divide-y divide-gray-800">
            {activeOrders.length === 0 ? (
              <p className="text-gray-500 text-sm px-6 py-4">No active orders</p>
            ) : (
              activeOrders.slice(0, 6).map((order) => (
                <div
                  key={order._id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {order.customer?.name}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {order.orderType} · {order.items?.length} item(s)
                      {order.table && ` · Table ${order.table.tableNumber}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 text-sm font-semibold">
                      ₦{order.totalAmount?.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                      order.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : order.status === 'confirmed'
                        ? 'bg-blue-500/10 text-blue-400'
                        : order.status === 'in-progress'
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'bg-teal-500/10 text-teal-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Tables overview + Today's reservations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tables */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">Tables Overview</h3>
            </div>
            <div className="p-4 grid grid-cols-4 gap-2">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className={`rounded-xl p-3 text-center border ${
                    table.status === 'available'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : table.status === 'occupied'
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : table.status === 'reserved'
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
                  }`}
                >
                  <p className="text-lg font-bold">{table.tableNumber}</p>
                  <p className="text-xs mt-0.5">{table.capacity}p</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Today's reservations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">Today's Reservations</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {todayReservations.length === 0 ? (
                <p className="text-gray-500 text-sm px-6 py-4">
                  No reservations today
                </p>
              ) : (
                todayReservations.map((r) => (
                  <div key={r._id} className="px-6 py-4 flex justify-between">
                    <div>
                      <p className="text-white text-sm">{r.customer?.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Table {r.table?.tableNumber} · {r.partySize} guests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-400 text-sm">{r.time}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                        r.status === 'confirmed'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;