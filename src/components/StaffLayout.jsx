import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faReceipt,
  faChair,
  faFire,
  faCalendarDays,
  faBoxesStacked,
  faCreditCard,
  faChevronLeft,
  faChevronRight,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';

const navItems = [
  { label: 'Dashboard',    path: '/staff/dashboard',    icon: faGauge },
  { label: 'Orders',       path: '/staff/orders',       icon: faReceipt },
  { label: 'Tables',       path: '/staff/tables',       icon: faChair },
  { label: 'Kitchen',      path: '/staff/kitchen',      icon: faFire },
  { label: 'Reservations', path: '/staff/reservations', icon: faCalendarDays },
  { label: 'Inventory',    path: '/staff/inventory',    icon: faBoxesStacked },
  { label: 'Billing',      path: '/staff/billing',      icon: faCreditCard },
];

const StaffLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <motion.aside
        animate={{ width: collapsed ? 70 : 240 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-orange-500 font-bold text-xl"
              >
                StackDine
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition"
          >
            <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="text-sm" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-800 ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border-r-2 border-orange-500'
                    : 'text-gray-400'
                }`
              }
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-base min-w-[24px] text-center"
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition text-sm w-full"
          >
            <FontAwesomeIcon
              icon={faPowerOff}
              className="text-base min-w-[24px] text-center"
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h1 className="text-gray-100 font-semibold text-lg">Staff Panel</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full border border-orange-500/20">
              Staff
            </span>
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-400 text-sm">{user?.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;