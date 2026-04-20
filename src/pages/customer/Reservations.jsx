import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerLayout from '../../components/CustomerLayout';
import API from '../../api/axios';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  cancelled: 'bg-red-500/10 text-red-400',
  completed: 'bg-green-500/10 text-green-400',
  'no-show': 'bg-gray-500/10 text-gray-400',
};

const ReservationModal = ({ onClose, onSaved }) => {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({
    tableId: '',
    date: '',
    time: '',
    partySize: '',
    specialRequest: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/reservations', {
        tableId: form.tableId,
        date: form.date,
        time: form.time,
        partySize: Number(form.partySize),
        specialRequest: form.specialRequest,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Make a Reservation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Select Table</label>
            <select
              value={form.tableId}
              onChange={(e) => setForm({ ...form, tableId: e.target.value })}
              required
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="">Choose a table</option>
              {tables.map((t) => (
                <option key={t._id} value={t._id}>
                  Table {t.tableNumber} — seats {t.capacity}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                min={today}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Party Size</label>
            <input
              type="number"
              value={form.partySize}
              onChange={(e) => setForm({ ...form, partySize: e.target.value })}
              required
              min="1"
              placeholder="Number of guests"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Special Request (optional)
            </label>
            <textarea
              value={form.specialRequest}
              onChange={(e) => setForm({ ...form, specialRequest: e.target.value })}
              rows={2}
              placeholder="Any special requests or dietary requirements..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm resize-none"
            />
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
              {loading ? 'Booking...' : 'Book Table'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CustomerReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [success, setSuccess] = useState(false);

  const fetchReservations = async () => {
    try {
      const { data } = await API.get('/reservations/myreservations');
      setReservations(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await API.patch(`/reservations/${id}/cancel`);
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filterStatus === 'all'
    ? reservations
    : reservations.filter((r) => r.status === filterStatus);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Reservations</h2>
            <p className="text-gray-400 text-sm mt-1">
              {reservations.length} total reservations
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
          >
            + Reserve Table
          </motion.button>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm"
            >
              Reservation booked successfully! 🎉
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map((s) => (
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
            <p className="text-4xl mb-3">📅</p>
            <p className="text-gray-400 font-medium">No reservations yet</p>
            <p className="text-gray-600 text-sm mt-1">
              Book a table to reserve your spot!
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              Make a Reservation
            </motion.button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[r.status]}`}>
                        {r.status}
                      </span>
                      <span className="text-gray-500 text-xs">
                        Table {r.table?.tableNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Date</p>
                        <p className="text-white">
                          {new Date(r.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Time</p>
                        <p className="text-white">{r.time}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Guests</p>
                        <p className="text-white">{r.partySize}</p>
                      </div>
                    </div>
                    {r.specialRequest && (
                      <p className="text-gray-500 text-xs">
                        📝 {r.specialRequest}
                      </p>
                    )}
                  </div>

                  {r.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(r._id)}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <ReservationModal
              onClose={() => setShowModal(false)}
              onSaved={() => {
                fetchReservations();
                setSuccess(true);
                setTimeout(() => setSuccess(false), 4000);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </CustomerLayout>
  );
};

export default CustomerReservations;