import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StaffLayout from '../../components/StaffLayout';
import API from '../../api/axios';

const statusColors = {
  available: 'bg-green-500/10 text-green-400 border-green-500/30',
  occupied: 'bg-red-500/10 text-red-400 border-red-500/30',
  reserved: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  maintenance: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

const TableDetailModal = ({ table, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    setLoading(true);
    try {
      await API.patch(`/tables/${table._id}/assign`);
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFree = async () => {
    setLoading(true);
    try {
      await API.patch(`/tables/${table._id}/free`);
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
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">
            Table {table.tableNumber}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Capacity</span>
            <span className="text-white">{table.capacity} guests</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[table.status]}`}>
              {table.status}
            </span>
          </div>
          {table.currentOrder && (
            <div className="bg-gray-800 rounded-lg px-4 py-3">
              <p className="text-gray-400 text-xs mb-1">Current Order</p>
              <p className="text-white text-sm capitalize">
                {table.currentOrder.orderType}
              </p>
              <p className={`text-xs mt-1 ${statusColors[table.currentOrder.status]?.split(' ')[1]}`}>
                {table.currentOrder.status}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {table.status === 'available' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAssign}
                disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Assigning...' : 'Assign Table'}
              </motion.button>
            )}
            {table.status === 'occupied' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFree}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Freeing...' : 'Free Table'}
              </motion.button>
            )}
            <button
              onClick={onClose}
              className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StaffTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchTables = async () => {
    try {
      const { data } = await API.get('/tables');
      setTables(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTables(); }, []);

  const filtered = filterStatus === 'all'
    ? tables
    : tables.filter((t) => t.status === filterStatus);

  const counts = {
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
    maintenance: tables.filter((t) => t.status === 'maintenance').length,
  };

  return (
    <StaffLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Tables</h2>
          <p className="text-gray-400 text-sm mt-1">{tables.length} tables total</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(counts).map(([status, count]) => (
            <div key={status} className={`rounded-xl border px-4 py-3 ${statusColors[status]}`}>
              <p className="text-xs capitalize">{status}</p>
              <p className="text-2xl font-bold mt-1">{count}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'available', 'occupied', 'reserved', 'maintenance'].map((s) => (
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

        {/* Tables grid */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {filtered.map((table) => (
                <motion.div
                  key={table._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelected(table)}
                  className={`rounded-2xl border p-4 text-center cursor-pointer transition ${statusColors[table.status]}`}
                >
                  <p className="text-3xl font-bold">{table.tableNumber}</p>
                  <p className="text-xs mt-1">{table.capacity} guests</p>
                  <p className="text-xs mt-2 capitalize">{table.status}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {selected && (
            <TableDetailModal
              table={selected}
              onClose={() => setSelected(null)}
              onUpdated={fetchTables}
            />
          )}
        </AnimatePresence>
      </div>
    </StaffLayout>
  );
};

export default StaffTables;