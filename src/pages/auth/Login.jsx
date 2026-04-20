// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { useAuth } from '../../context/AuthConteXt';
// import API from '../../api/axios';

// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const { data } = await API.post('/auth/login', form);
//       login(data.user, data.token);
//       if (data.user.role === 'admin') navigate('/admin/dashboard');
//       else if (data.user.role === 'staff') navigate('/staff/dashboard');
//       else navigate('/customer/home');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md"
//       >
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-orange-500">StackDine</h1>
//           <p className="text-gray-400 mt-2">Sign in to your account</p>
//         </div>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm"
//           >
//             {error}
//           </motion.div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm text-gray-400 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//               placeholder="you@example.com"
//               className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-400 mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               placeholder="••••••••"
//               className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
//             />
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             type="submit"
//             disabled={loading}
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
//           >
//             {loading ? 'Signing in...' : 'Sign In'}
//           </motion.button>
//         </form>

//         <p className="text-center text-gray-500 text-sm mt-6">
//           Don't have an account?{' '}
//           <Link to="/register" className="text-orange-400 hover:text-orange-300">
//             Register
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;




import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// FIX: corrected casing — was 'AuthConteXt' (capital X breaks on Linux/CI)
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  // FIX: pick up the "just registered" flag passed from Register
  const location = useLocation();
  const justRegistered = location.state?.registered;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', form);

      // FIX: login() is inside the try block so any sync throw is caught
      login(data.user, data.token);

      // FIX: navigate is the very last thing — only reached on full success
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'staff') navigate('/staff/dashboard');
      else navigate('/customer/home');
    } catch (err) {
      // FIX: distinguish credential errors from network failures
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (!err.response) {
        setError('Network error — please check your connection and try again');
      } else {
        setError(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-orange-500">StackDine</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* FIX: success banner shown when redirected from Register */}
        {justRegistered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm"
          >
            Account created successfully — please sign in.
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-400 hover:text-orange-300">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;