import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerLayout from '../../components/CustomerLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const CustomerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    phone: '',
    address: { street: '', city: '', state: '' },
    preferences: '',
    allergies: '',
  });

  const [feedback, setFeedback] = useState({ message: '', rating: 5 });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/customers/me');
      setProfile(data.data);
      setForm({
        phone: data.data.phone || '',
        address: data.data.address || { street: '', city: '', state: '' },
        preferences: data.data.preferences?.join(', ') || '',
        allergies: data.data.allergies?.join(', ') || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const showSuccess = (msg) => {
    setError('');
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.put('/customers/me', {
        phone: form.phone,
        address: form.address,
        preferences: form.preferences.split(',').map((p) => p.trim()).filter(Boolean),
        allergies: form.allergies.split(',').map((a) => a.trim()).filter(Boolean),
      });
      fetchProfile();
      setEditMode(false);
      showSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/customers/feedback', feedback);
      fetchProfile();
      setFeedbackMode(false);
      setFeedback({ message: '', rating: 5 });
      showSuccess('Feedback submitted!');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (passwordForm.newPassword.length < 8) {
      return setError('New password must be at least 8 characters');
    }
    try {
      await API.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMode(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSuccess('Password changed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading)
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div>
        </div>
      </CustomerLayout>
    );

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">My Profile</h2>

        {/* Success / Error messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm"
            >
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">{user?.name}</h3>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full mt-1 inline-block">
                Customer
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-800">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">
                {profile?.orderHistory?.length || 0}
              </p>
              <p className="text-gray-500 text-xs mt-1">Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                {profile?.loyaltyPoints || 0}
              </p>
              <p className="text-gray-500 text-xs mt-1">Loyalty pts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                ₦{profile?.totalSpent?.toLocaleString() || 0}
              </p>
              <p className="text-gray-500 text-xs mt-1">Total spent</p>
            </div>
          </div>
        </motion.div>

        {/* Personal info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Personal Info</h3>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-orange-400 text-sm hover:text-orange-300 transition"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Your phone number"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Street</label>
                <input
                  value={form.address.street}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                  placeholder="Street address"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">City</label>
                  <input
                    value={form.address.city}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                    placeholder="City"
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">State</label>
                  <input
                    value={form.address.state}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
                    placeholder="State"
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Food Preferences (comma separated)
                </label>
                <input
                  value={form.preferences}
                  onChange={(e) => setForm({ ...form, preferences: e.target.value })}
                  placeholder="e.g. vegetarian, spicy, grilled"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Allergies (comma separated)
                </label>
                <input
                  value={form.allergies}
                  onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                  placeholder="e.g. nuts, dairy, gluten"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold transition"
              >
                Save Changes
              </motion.button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Phone</span>
                <span className="text-white">{profile?.phone || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Street</span>
                <span className="text-white">{profile?.address?.street || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">City</span>
                <span className="text-white">{profile?.address?.city || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">State</span>
                <span className="text-white">{profile?.address?.state || '—'}</span>
              </div>
              {profile?.preferences?.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferences.map((p, i) => (
                      <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile?.allergies?.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((a, i) => (
                      <span key={i} className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Change password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Change Password</h3>
            <button
              onClick={() => { setPasswordMode(!passwordMode); setError(''); }}
              className="text-orange-400 text-sm hover:text-orange-300 transition"
            >
              {passwordMode ? 'Cancel' : 'Change'}
            </button>
          </div>

          <AnimatePresence>
            {passwordMode && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handlePasswordChange}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  Update Password
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Leave Feedback</h3>
            <button
              onClick={() => { setFeedbackMode(!feedbackMode); setError(''); }}
              className="text-orange-400 text-sm hover:text-orange-300 transition"
            >
              {feedbackMode ? 'Cancel' : 'Write'}
            </button>
          </div>

          <AnimatePresence>
            {feedbackMode && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleFeedback}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedback({ ...feedback, rating: star })}
                        className={`text-2xl transition ${
                          star <= feedback.rating ? 'text-orange-400' : 'text-gray-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Message</label>
                  <textarea
                    value={feedback.message}
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                    required
                    rows={4}
                    placeholder="Tell us about your experience..."
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  Submit Feedback
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Past feedback */}
          {profile?.feedback?.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-gray-400 text-sm">Your past feedback</p>
              {profile.feedback.map((f, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${star <= f.rating ? 'text-orange-400' : 'text-gray-600'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-gray-500 text-xs ml-2">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{f.message}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerProfile;