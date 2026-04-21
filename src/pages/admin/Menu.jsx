// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import AdminLayout from '../../components/AdminLayout';
// import API from '../../api/axios';

// const categories = ['starter', 'main', 'dessert', 'drink', 'side'];

// const MenuModal = ({ item, onClose, onSaved }) => {
//   const [form, setForm] = useState({
//     name: item?.name || '',
//     description: item?.description || '',
//     price: item?.price || '',
//     category: item?.category || 'main',
//     preparationTime: item?.preparationTime || '',
//     isAvailable: item?.isAvailable ?? true,
//   });
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
//     setForm({ ...form, [e.target.name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const formData = new FormData();
//       Object.keys(form).forEach((key) => formData.append(key, form[key]));
//       if (image) formData.append('image', image);

//       if (item) {
//         await API.put(`/menu/${item._id}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       } else {
//         await API.post('/menu', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       }
//       onSaved();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800"
//       >
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-white font-semibold text-lg">
//             {item ? 'Edit Menu Item' : 'Add Menu Item'}
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
//         </div>

//         {error && (
//           <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">Name</label>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">Category</label>
//               <select
//                 name="category"
//                 value={form.category}
//                 onChange={handleChange}
//                 className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
//               >
//                 {categories.map((c) => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-400 mb-1">Description</label>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               required
//               rows={3}
//               className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm resize-none"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">Price (₦)</label>
//               <input
//                 name="price"
//                 type="number"
//                 value={form.price}
//                 onChange={handleChange}
//                 required
//                 className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">Prep Time (mins)</label>
//               <input
//                 name="preparationTime"
//                 type="number"
//                 value={form.preparationTime}
//                 onChange={handleChange}
//                 className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-400 mb-1">Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setImage(e.target.files[0])}
//               className="w-full bg-gray-800 text-gray-400 border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="isAvailable"
//               checked={form.isAvailable}
//               onChange={handleChange}
//               className="accent-orange-500"
//             />
//             <label className="text-sm text-gray-400">Available</label>
//           </div>

//           <div className="flex gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition"
//             >
//               Cancel
//             </button>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               disabled={loading}
//               className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
//             >
//               {loading ? 'Saving...' : 'Save Item'}
//             </motion.button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// const AdminMenu = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [filterCategory, setFilterCategory] = useState('all');

//   const fetchItems = async () => {
//     try {
//       const { data } = await API.get('/menu');
//       setItems(data.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchItems(); }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this menu item?')) return;
//     try {
//       await API.delete(`/menu/${id}`);
//       fetchItems();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleToggle = async (id) => {
//     try {
//       await API.patch(`/menu/${id}/availability`);
//       fetchItems();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filtered = filterCategory === 'all'
//     ? items
//     : items.filter((i) => i.category === filterCategory);

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-white">Menu</h2>
//             <p className="text-gray-400 text-sm mt-1">{items.length} items total</p>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => { setSelectedItem(null); setShowModal(true); }}
//             className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
//           >
//             + Add Item
//           </motion.button>
//         </div>

//         {/* Filter */}
//         <div className="flex gap-2 flex-wrap">
//           {['all', ...categories].map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setFilterCategory(cat)}
//               className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${
//                 filterCategory === cat
//                   ? 'bg-orange-500 text-white'
//                   : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Items grid */}
//         {loading ? (
//           <div className="flex items-center justify-center h-40">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             <AnimatePresence>
//               {filtered.map((item) => (
//                 <motion.div
//                   key={item._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
//                 >
//                   {item.image?.url ? (
//                     <img
//                       src={item.image.url}
//                       alt={item.name}
//                       className="w-full h-40 object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-40 bg-gray-800 flex items-center justify-center text-gray-600 text-sm">
//                       No image
//                     </div>
//                   )}
//                   <div className="p-4">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <h4 className="text-white font-semibold">{item.name}</h4>
//                         <p className="text-gray-500 text-xs capitalize mt-0.5">{item.category}</p>
//                       </div>
//                       <span className={`text-xs px-2 py-1 rounded-full ${
//                         item.isAvailable
//                           ? 'bg-green-500/10 text-green-400'
//                           : 'bg-red-500/10 text-red-400'
//                       }`}>
//                         {item.isAvailable ? 'Available' : 'Unavailable'}
//                       </span>
//                     </div>
//                     <p className="text-gray-400 text-xs mt-2 line-clamp-2">{item.description}</p>
//                     <p className="text-orange-400 font-bold mt-3">₦{item.price?.toLocaleString()}</p>
//                     <div className="flex gap-2 mt-3">
//                       <button
//                         onClick={() => handleToggle(item._id)}
//                         className="flex-1 text-xs border border-gray-700 text-gray-400 py-1.5 rounded-lg hover:bg-gray-800 transition"
//                       >
//                         Toggle
//                       </button>
//                       <button
//                         onClick={() => { setSelectedItem(item); setShowModal(true); }}
//                         className="flex-1 text-xs border border-blue-500/30 text-blue-400 py-1.5 rounded-lg hover:bg-blue-500/10 transition"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(item._id)}
//                         className="flex-1 text-xs border border-red-500/30 text-red-400 py-1.5 rounded-lg hover:bg-red-500/10 transition"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}

//         {/* Modal */}
//         <AnimatePresence>
//           {showModal && (
//             <MenuModal
//               item={selectedItem}
//               onClose={() => setShowModal(false)}
//               onSaved={fetchItems}
//             />
//           )}
//         </AnimatePresence>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminMenu;




import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/axios';

const categories = ['starter', 'main', 'dessert', 'drink', 'side'];

const MenuModal = ({ item, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    category: item?.category || 'main',
    preparationTime: item?.preparationTime || '',
    isAvailable: item?.isAvailable ?? true,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(item?.image?.url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // FIX: validate numbers before sending
    if (Number(form.price) <= 0) return setError('Price must be greater than 0');

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (image) formData.append('image', image);

      if (item) {
        await API.put(`/menu/${item._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await API.post('/menu', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
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
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">
            {item ? 'Edit Menu Item' : 'Add Menu Item'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Price (₦)</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                min="1"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Prep Time (mins)</label>
              <input
                name="preparationTime"
                type="number"
                value={form.preparationTime}
                onChange={handleChange}
                min="1"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Image</label>
            {/* FIX: image preview */}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-36 object-cover rounded-lg mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-gray-800 text-gray-400 border border-gray-700 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
              className="accent-orange-500"
            />
            <label className="text-sm text-gray-400">Available</label>
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
              {loading ? 'Saving...' : 'Save Item'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  // FIX: page-level feedback states
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const fetchItems = async () => {
    try {
      const { data } = await API.get('/menu');
      // FIX: safe fallback so .filter() never crashes
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      showToast('Failed to load menu items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await API.delete(`/menu/${id}`);
      // FIX: optimistic UI — remove from state immediately instead of refetching
      setItems((prev) => prev.filter((i) => i._id !== id));
      showToast('Item deleted successfully');
    } catch (err) {
      // FIX: was silently console.error — now shows the user what went wrong
      showToast(err.response?.data?.message || 'Failed to delete item', 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await API.patch(`/menu/${id}/availability`);
      // FIX: update just that item in state instead of full refetch
      setItems((prev) =>
        prev.map((i) => (i._id === id ? data.data : i))
      );
      showToast(data.message || 'Availability updated');
    } catch (err) {
      // FIX: was silently console.error
      showToast(err.response?.data?.message || 'Failed to update availability', 'error');
    }
  };

  const filtered = filterCategory === 'all'
    ? items
    : items.filter((i) => i.category === filterCategory);

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* FIX: toast notification for page-level feedback */}
        <AnimatePresence>
          {toast.message && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${
                toast.type === 'error'
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                  : 'bg-green-500/10 border border-green-500/30 text-green-400'
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Menu</h2>
            <p className="text-gray-400 text-sm mt-1">{items.length} items total</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedItem(null); setShowModal(true); }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
          >
            + Add Item
          </motion.button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${
                filterCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items grid */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        ) : filtered.length === 0 ? (
          // FIX: empty state instead of blank screen
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <p className="text-sm">No menu items found</p>
            {filterCategory !== 'all' && (
              <button
                onClick={() => setFilterCategory('all')}
                className="text-orange-400 text-xs mt-2 hover:text-orange-300 transition"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
                >
                  {item.image?.url ? (
                    <img
                      src={item.image.url}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-800 flex items-center justify-center text-gray-600 text-sm">
                      No image
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white font-semibold">{item.name}</h4>
                        <p className="text-gray-500 text-xs capitalize mt-0.5">{item.category}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.isAvailable
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2 line-clamp-2">{item.description}</p>
                    <p className="text-orange-400 font-bold mt-3">₦{item.price?.toLocaleString()}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleToggle(item._id)}
                        className="flex-1 text-xs border border-gray-700 text-gray-400 py-1.5 rounded-lg hover:bg-gray-800 transition"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => { setSelectedItem(item); setShowModal(true); }}
                        className="flex-1 text-xs border border-blue-500/30 text-blue-400 py-1.5 rounded-lg hover:bg-blue-500/10 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 text-xs border border-red-500/30 text-red-400 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <MenuModal
              item={selectedItem}
              onClose={() => setShowModal(false)}
              onSaved={() => {
                fetchItems();
                showToast(selectedItem ? 'Item updated successfully' : 'Item added successfully');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminMenu;