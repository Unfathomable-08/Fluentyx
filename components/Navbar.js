import { FaBell, FaCog, FaRegMoon } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="w-full sticky top-0 z-50 bg-[var(--primary)] text-white shadow-md px-4 py-3 sm:px-12 md:px-20 flex items-center justify-between">
      {/* Logo or Brand */}
      <div className="text-xl font-bold tracking-wide">
        Fluentyx
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4 text-lg">
        <button className="hover:text-white/80 transition" aria-label="Notifications">
          <FaBell />
        </button>
        <button className="hover:text-white/80 transition" aria-label="Toggle Theme">
          <FaRegMoon />
        </button>
        <button className="hover:text-white/80 transition" aria-label="Settings">
          <FaCog />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
