import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/axios';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const LocationModal = ({ location, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: location?.name || '',
    phone: location?.phone || '',
    email: location?.email || '',
    address: {
      street: location?.address?.street || '',
      city: location?.address?.city || '',
      state: location?.address?.state || '',
      country: location?.address?.country || '',
    },
    openingHours: location?.openingHours || {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '08:00', close: '22:00' },
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setForm({ ...form, address: { ...form.address, [e.target.name]: e.target.value } });
  };

  const handleHoursChange = (day, type, value) => {
    setForm({
      ...form,
      openingHours: {
        ...form.openingHours,
        [day]: { ...form.openingHours[day], [type]: value },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (location) {
        await API.put(`/locations/${location._id}`, form);
      } else {
        await API.post('/locations', form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">
            {location ? 'Edit Location' : 'Add Location'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Location Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. StackDine Abuja"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Address */}
          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-400 text-sm mb-3">Address</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <input
                  name="street"
                  value={form.address.street}
                  onChange={handleAddressChange}
                  required
                  placeholder="Street"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <input
                  name="city"
                  value={form.address.city}
                  onChange={handleAddressChange}
                  required
                  placeholder="City"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <input
                  name="state"
                  value={form.address.state}
                  onChange={handleAddressChange}
                  required
                  placeholder="State"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div className="col-span-2">
                <input
                  name="country"
                  value={form.address.country}
                  onChange={handleAddressChange}
                  required
                  placeholder="Country"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Opening hours */}
          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-400 text-sm mb-3">Opening Hours</p>
            <div className="space-y-2">
              {days.map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm capitalize w-24">{day}</span>
                  <input
                    type="time"
                    value={form.openingHours[day]?.open || ''}
                    onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                    className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <span className="text-gray-500 text-sm">to</span>
                  <input
                    type="time"
                    value={form.openingHours[day]?.close || ''}
                    onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                    className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              ))}
            </div>
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
              {loading ? 'Saving...' : 'Save Location'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchLocations = async () => {
    try {
      const { data } = await API.get('/locations');
      setLocations(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLocations(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this location?')) return;
    try {
      await API.delete(`/locations/${id}`);
      fetchLocations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/locations/${id}/toggle`);
      fetchLocations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Locations</h2>
            <p className="text-gray-400 text-sm mt-1">{locations.length} locations</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelected(null); setShowModal(true); }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
          >
            + Add Location
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {locations.length === 0 ? (
                <div className="col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
                  <p className="text-gray-500 text-sm">No locations added yet</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Add your first restaurant location to get started
                  </p>
                </div>
              ) : (
                locations.map((loc) => (
                  <motion.div
                    key={loc._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-gray-900 rounded-2xl border border-gray-800 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{loc.name}</h3>
                        <p className="text-gray-400 text-sm mt-0.5">
                          {loc.address?.street}, {loc.address?.city}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {loc.address?.state}, {loc.address?.country}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        loc.isActive
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {loc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">📞</span>
                        <span className="text-gray-400">{loc.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">✉️</span>
                        <span className="text-gray-400">{loc.email}</span>
                      </div>
                    </div>

                    {/* Opening hours preview */}
                    <div className="border-t border-gray-800 pt-4 mb-4">
                      <p className="text-gray-500 text-xs mb-2">Opening Hours</p>
                      <div className="grid grid-cols-2 gap-1">
                        {days.slice(0, 4).map((day) => (
                          <div key={day} className="flex justify-between text-xs">
                            <span className="text-gray-500 capitalize">{day.slice(0, 3)}</span>
                            <span className="text-gray-400">
                              {loc.openingHours?.[day]?.open} - {loc.openingHours?.[day]?.close}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggle(loc._id)}
                        className={`flex-1 text-xs py-2 rounded-lg border transition ${
                          loc.isActive
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                        }`}
                      >
                        {loc.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => { setSelected(loc); setShowModal(true); }}
                        className="flex-1 text-xs py-2 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(loc._id)}
                        className="flex-1 text-xs py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <LocationModal
              location={selected}
              onClose={() => setShowModal(false)}
              onSaved={fetchLocations}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminLocations;