import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/axios';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  cancelled: 'bg-red-500/10 text-red-400',
  completed: 'bg-green-500/10 text-green-400',
  'no-show': 'bg-gray-500/10 text-gray-400',
};

const ReservationModal = ({ reservation, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handleStatus = async (status) => {
    setLoading(true);
    try {
      await API.patch(`/reservations/${reservation._id}/status`, { status });
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
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Reservation Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Customer</span>
            <span className="text-white">{reservation.customer?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Email</span>
            <span className="text-white">{reservation.customer?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Table</span>
            <span className="text-white">
              Table {reservation.table?.tableNumber} (capacity: {reservation.table?.capacity})
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Date</span>
            <span className="text-white">
              {new Date(reservation.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Time</span>
            <span className="text-white">{reservation.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Party Size</span>
            <span className="text-white">{reservation.partySize} guests</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[reservation.status]}`}>
              {reservation.status}
            </span>
          </div>
          {reservation.specialRequest && (
            <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-400">
              Special request: {reservation.specialRequest}
            </div>
          )}

          {reservation.status === 'pending' && (
            <div className="border-t border-gray-800 pt-4">
              <p className="text-gray-400 text-sm mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatus('confirmed')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg text-xs border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition disabled:opacity-50"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatus('cancelled')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatus('no-show')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg text-xs border border-gray-500/30 text-gray-400 hover:bg-gray-500/10 transition disabled:opacity-50"
                >
                  No Show
                </button>
                <button
                  onClick={() => handleStatus('completed')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg text-xs border border-green-500/30 text-green-400 hover:bg-green-500/10 transition disabled:opacity-50"
                >
                  Complete
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchReservations = async () => {
    try {
      const { data } = await API.get('/reservations');
      setReservations(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, []);

  const filtered = filterStatus === 'all'
    ? reservations
    : reservations.filter((r) => r.status === filterStatus);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Reservations</h2>
          <p className="text-gray-400 text-sm mt-1">{reservations.length} total reservations</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map((s) => (
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
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Customer</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Table</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Date</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Time</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Party</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Status</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 py-8 text-sm">
                        No reservations found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <motion.tr
                        key={r._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-800/50 transition"
                      >
                        <td className="px-6 py-4">
                          <p className="text-white text-sm">{r.customer?.name}</p>
                          <p className="text-gray-500 text-xs">{r.customer?.email}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          Table {r.table?.tableNumber}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {new Date(r.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{r.time}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{r.partySize}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[r.status]}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelected(r)}
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
            <ReservationModal
              reservation={selected}
              onClose={() => setSelected(null)}
              onUpdated={fetchReservations}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminReservations;