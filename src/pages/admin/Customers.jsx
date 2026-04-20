import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/axios';

const CustomerModal = ({ customer, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handleBlacklist = async () => {
    setLoading(true);
    try {
      await API.patch(`/customers/${customer._id}/blacklist`);
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
          <h3 className="text-white font-semibold text-lg">Customer Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-2xl font-bold">
              {customer.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold">{customer.user?.name}</p>
              <p className="text-gray-400 text-sm">{customer.user?.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Phone</span>
              <span className="text-white">{customer.phone || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Spent</span>
              <span className="text-orange-400 font-semibold">
                ₦{customer.totalSpent?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Loyalty Points</span>
              <span className="text-purple-400 font-semibold">
                {customer.loyaltyPoints} pts
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Orders</span>
              <span className="text-white">{customer.orderHistory?.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                customer.isBlacklisted
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-green-500/10 text-green-400'
              }`}>
                {customer.isBlacklisted ? 'Blacklisted' : 'Active'}
              </span>
            </div>
          </div>

          {/* Preferences */}
          {customer.preferences?.length > 0 && (
            <div className="border-t border-gray-800 pt-4">
              <p className="text-gray-400 text-sm mb-2">Preferences</p>
              <div className="flex flex-wrap gap-2">
                {customer.preferences.map((p, i) => (
                  <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergies */}
          {customer.allergies?.length > 0 && (
            <div className="border-t border-gray-800 pt-4">
              <p className="text-gray-400 text-sm mb-2">Allergies</p>
              <div className="flex flex-wrap gap-2">
                {customer.allergies.map((a, i) => (
                  <span key={i} className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          {customer.feedback?.length > 0 && (
            <div className="border-t border-gray-800 pt-4">
              <p className="text-gray-400 text-sm mb-2">Recent Feedback</p>
              <div className="space-y-2">
                {customer.feedback.slice(-2).map((f, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg px-3 py-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-yellow-400">{'★'.repeat(f.rating)}</span>
                      <span className="text-gray-500">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs">{f.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleBlacklist}
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-sm transition disabled:opacity-50 ${
              customer.isBlacklisted
                ? 'border border-green-500/30 text-green-400 hover:bg-green-500/10'
                : 'border border-red-500/30 text-red-400 hover:bg-red-500/10'
            }`}
          >
            {loading
              ? 'Processing...'
              : customer.isBlacklisted
              ? 'Remove from Blacklist'
              : 'Blacklist Customer'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [showBlacklisted, setShowBlacklisted] = useState(false);

  const fetchCustomers = async () => {
    try {
      const { data } = await API.get('/customers');
      setCustomers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filtered = customers
    .filter((c) => !showBlacklisted || c.isBlacklisted)
    .filter((c) =>
      c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.user?.email?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Customers</h2>
          <p className="text-gray-400 text-sm mt-1">{customers.length} registered customers</p>
        </div>

        {/* Search + filter */}
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
          />
          <button
            onClick={() => setShowBlacklisted(!showBlacklisted)}
            className={`px-4 py-2.5 rounded-lg text-sm transition ${
              showBlacklisted
                ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {showBlacklisted ? 'Show All' : 'Blacklisted'}
          </button>
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
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Phone</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Orders</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Total Spent</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Loyalty</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Status</th>
                    <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 py-8 text-sm">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((customer) => (
                      <motion.tr
                        key={customer._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-800/50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-sm font-bold">
                              {customer.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white text-sm">{customer.user?.name}</p>
                              <p className="text-gray-500 text-xs">{customer.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {customer.phone || '—'}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {customer.orderHistory?.length}
                        </td>
                        <td className="px-6 py-4 text-orange-400 text-sm font-semibold">
                          ₦{customer.totalSpent?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-purple-400 text-sm">
                          {customer.loyaltyPoints} pts
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            customer.isBlacklisted
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {customer.isBlacklisted ? 'Blacklisted' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelected(customer)}
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
            <CustomerModal
              customer={selected}
              onClose={() => setSelected(null)}
              onUpdated={fetchCustomers}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;