// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import AdminLayout from '../../components/AdminLayout';
// import API from '../../api/axios';

// const statusColors = {
//   available: 'bg-green-500/10 text-green-400 border-green-500/30',
//   occupied: 'bg-red-500/10 text-red-400 border-red-500/30',
//   reserved: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
//   maintenance: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
// };

// const TableModal = ({ table, onClose, onSaved }) => {
//   const [form, setForm] = useState({
//     tableNumber: table?.tableNumber || '',
//     capacity: table?.capacity || '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       if (table) {
//         await API.put(`/tables/${table._id}`, form);
//       } else {
//         await API.post('/tables', form);
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
//         className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800"
//       >
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-white font-semibold text-lg">
//             {table ? 'Edit Table' : 'Add Table'}
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
//         </div>

//         {error && (
//           <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-400 mb-1">Table Number</label>
//             <input
//               type="number"
//               value={form.tableNumber}
//               onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
//               required
//               className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 text-sm"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-400 mb-1">Capacity</label>
//             <input
//               type="number"
//               value={form.capacity}
//               onChange={(e) => setForm({ ...form, capacity: e.target.value })}
//               required
//               className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 text-sm"
//             />
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
//               {loading ? 'Saving...' : 'Save Table'}
//             </motion.button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// const AdminTables = () => {
//   const [tables, setTables] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [filterStatus, setFilterStatus] = useState('all');

//   const fetchTables = async () => {
//     try {
//       const { data } = await API.get('/tables');
//       setTables(data.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchTables(); }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this table?')) return;
//     try {
//       await API.delete(`/tables/${id}`);
//       fetchTables();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleFree = async (id) => {
//     try {
//       await API.patch(`/tables/${id}/free`);
//       fetchTables();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filtered = filterStatus === 'all'
//     ? tables
//     : tables.filter((t) => t.status === filterStatus);

//   const counts = {
//     available: tables.filter((t) => t.status === 'available').length,
//     occupied: tables.filter((t) => t.status === 'occupied').length,
//     reserved: tables.filter((t) => t.status === 'reserved').length,
//     maintenance: tables.filter((t) => t.status === 'maintenance').length,
//   };

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-white">Tables</h2>
//             <p className="text-gray-400 text-sm mt-1">{tables.length} tables total</p>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => { setSelectedTable(null); setShowModal(true); }}
//             className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
//           >
//             + Add Table
//           </motion.button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {Object.entries(counts).map(([status, count]) => (
//             <div key={status} className={`rounded-xl border px-4 py-3 ${statusColors[status]}`}>
//               <p className="text-xs capitalize">{status}</p>
//               <p className="text-2xl font-bold mt-1">{count}</p>
//             </div>
//           ))}
//         </div>

//         {/* Filter */}
//         <div className="flex gap-2 flex-wrap">
//           {['all', 'available', 'occupied', 'reserved', 'maintenance'].map((s) => (
//             <button
//               key={s}
//               onClick={() => setFilterStatus(s)}
//               className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${
//                 filterStatus === s
//                   ? 'bg-orange-500 text-white'
//                   : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
//               }`}
//             >
//               {s}
//             </button>
//           ))}
//         </div>

//         {/* Tables grid */}
//         {loading ? (
//           <div className="flex items-center justify-center h-40">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//             <AnimatePresence>
//               {filtered.map((table) => (
//                 <motion.div
//                   key={table._id}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0 }}
//                   whileHover={{ scale: 1.03 }}
//                   className="bg-gray-900 rounded-2xl border border-gray-800 p-4 text-center"
//                 >
//                   <div className={`w-14 h-14 rounded-xl border-2 mx-auto flex items-center justify-center text-2xl font-bold ${statusColors[table.status]}`}>
//                     {table.tableNumber}
//                   </div>
//                   <p className="text-white text-sm font-medium mt-3">
//                     Table {table.tableNumber}
//                   </p>
//                   <p className="text-gray-500 text-xs mt-0.5">
//                     Capacity: {table.capacity}
//                   </p>
//                   <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block border ${statusColors[table.status]}`}>
//                     {table.status}
//                   </span>
//                   <div className="flex gap-1 mt-3">
//                     {table.status === 'occupied' && (
//                       <button
//                         onClick={() => handleFree(table._id)}
//                         className="flex-1 text-xs border border-green-500/30 text-green-400 py-1 rounded-lg hover:bg-green-500/10 transition"
//                       >
//                         Free
//                       </button>
//                     )}
//                     <button
//                       onClick={() => { setSelectedTable(table); setShowModal(true); }}
//                       className="flex-1 text-xs border border-blue-500/30 text-blue-400 py-1 rounded-lg hover:bg-blue-500/10 transition"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(table._id)}
//                       className="flex-1 text-xs border border-red-500/30 text-red-400 py-1 rounded-lg hover:bg-red-500/10 transition"
//                     >
//                       Del
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}

//         <AnimatePresence>
//           {showModal && (
//             <TableModal
//               table={selectedTable}
//               onClose={() => setShowModal(false)}
//               onSaved={fetchTables}
//             />
//           )}
//         </AnimatePresence>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminTables;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/axios';

const statusColors = {
  available: 'bg-green-500/10 text-green-400 border-green-500/30',
  occupied: 'bg-red-500/10 text-red-400 border-red-500/30',
  reserved: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  maintenance: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

const floorColors = {
  available: 'bg-green-500/20 border-green-500/50 text-green-400',
  occupied: 'bg-red-500/20 border-red-500/50 text-red-400',
  reserved: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  maintenance: 'bg-gray-500/20 border-gray-500/50 text-gray-400',
};

const TableModal = ({ table, onClose, onSaved }) => {
  const [form, setForm] = useState({
    tableNumber: table?.tableNumber || '',
    capacity: table?.capacity || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (table) {
        await API.put(`/tables/${table._id}`, form);
      } else {
        await API.post('/tables', form);
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">
            {table ? 'Edit Table' : 'Add Table'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Table Number</label>
            <input
              type="number"
              value={form.tableNumber}
              onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
              required
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Capacity</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              required
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 text-sm"
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
              {loading ? 'Saving...' : 'Save Table'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const FloorPlan = ({ tables, onSelect }) => (
  <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
    {/* Legend */}
    <div className="flex flex-wrap gap-4 mb-6">
      {Object.entries(floorColors).map(([status, color]) => (
        <div key={status} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded border ${color}`} />
          <span className="text-gray-400 text-xs capitalize">{status}</span>
        </div>
      ))}
    </div>

    {/* Restaurant boundary */}
    <div className="relative bg-gray-950 rounded-xl border-2 border-dashed border-gray-700 p-6 min-h-80">
      {/* Entrance label */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3">
        <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
          🚪 Entrance
        </span>
      </div>

      {/* Kitchen label */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3">
        <span className="bg-gray-800 text-orange-400 text-xs px-3 py-1 rounded-full border border-orange-500/30">
          🍳 Kitchen
        </span>
      </div>

      {/* Tables grid inside floor */}
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-4 pt-4 pb-6">
        {tables.map((table) => (
          <motion.div
            key={table._id}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(table)}
            className={`rounded-xl border-2 p-3 text-center cursor-pointer transition ${floorColors[table.status]}`}
          >
            <div className="text-2xl font-bold">{table.tableNumber}</div>
            <div className="text-xs mt-1">👥 {table.capacity}</div>
            <div className="text-xs mt-1 capitalize opacity-75">{table.status}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await API.delete(`/tables/${id}`);
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFree = async (id) => {
    try {
      await API.patch(`/tables/${id}/free`);
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

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
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Tables</h2>
            <p className="text-gray-400 text-sm mt-1">{tables.length} tables total</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => setViewMode('floor')}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  viewMode === 'floor'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🏠 Floor Plan
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedTable(null); setShowModal(true); }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              + Add Table
            </motion.button>
          </div>
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

        {/* Filter — only show in grid mode */}
        {viewMode === 'grid' && (
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
        )}

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'floor' ? (
              <motion.div
                key="floor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FloorPlan
                  tables={tables}
                  onSelect={(table) => { setSelectedTable(table); setShowModal(true); }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                {filtered.map((table) => (
                  <motion.div
                    key={table._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-gray-900 rounded-2xl border border-gray-800 p-4 text-center"
                  >
                    <div className={`w-14 h-14 rounded-xl border-2 mx-auto flex items-center justify-center text-2xl font-bold ${statusColors[table.status]}`}>
                      {table.tableNumber}
                    </div>
                    <p className="text-white text-sm font-medium mt-3">
                      Table {table.tableNumber}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Capacity: {table.capacity}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block border ${statusColors[table.status]}`}>
                      {table.status}
                    </span>
                    <div className="flex gap-1 mt-3">
                      {table.status === 'occupied' && (
                        <button
                          onClick={() => handleFree(table._id)}
                          className="flex-1 text-xs border border-green-500/30 text-green-400 py-1 rounded-lg hover:bg-green-500/10 transition"
                        >
                          Free
                        </button>
                      )}
                      <button
                        onClick={() => { setSelectedTable(table); setShowModal(true); }}
                        className="flex-1 text-xs border border-blue-500/30 text-blue-400 py-1 rounded-lg hover:bg-blue-500/10 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(table._id)}
                        className="flex-1 text-xs border border-red-500/30 text-red-400 py-1 rounded-lg hover:bg-red-500/10 transition"
                      >
                        Del
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {showModal && (
            <TableModal
              table={selectedTable}
              onClose={() => setShowModal(false)}
              onSaved={fetchTables}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminTables;