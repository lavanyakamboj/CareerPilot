import {
  FiLogOut,
  FiSettings,
  FiX,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

import { sidebarItems } from "../../data/dashboardData";

function Sidebar({
  isOpen,
  onClose,
  userName = "Student",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedResumeId");

    navigate("/login");
  };

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col
          bg-career-sidebar bg-career-sidebar-image px-5 py-6
          text-white shadow-sidebar transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 border-none bg-transparent p-0 text-white"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.07] text-lg">
              ◇
            </span>

            <span className="font-heading text-2xl">
              CareerPilot<span className="text-[#A48AF4]">.</span>
            </span>
          </button>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-xl text-white lg:hidden"
          >
            <FiX />
          </button>
        </div>

        <div className="mx-1 mb-6 mt-10 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B6AAD4]">
            Your workspace
          </span>

          <p className="mb-0 mt-2 font-heading text-lg leading-snug text-[#E3DDEF]">
            Everything for your first offer, quietly organised.
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex w-full items-center gap-3 rounded-xl border px-3.5 py-3
                  text-left text-sm transition
                  ${
                    active
                      ? "border-[#9F82F5]/20 bg-gradient-to-r from-[#774FDA]/25 to-white/[0.04] text-white"
                      : "border-transparent text-[#C5BED7] hover:bg-white/[0.06] hover:text-white"
                  }
                `}
              >
                <Icon className="text-lg" />

                <span>{item.label}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#A083F5]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#C5BED7] transition hover:bg-white/[0.06] hover:text-white"
          >
            <FiSettings className="text-lg" />
            Settings
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#D6B6C8] transition hover:bg-white/[0.06] hover:text-white"
          >
            <FiLogOut className="text-lg" />
            Log out
          </button>

          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#A48AF3] to-[#6042BF] font-semibold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {userName}
              </p>

              <p className="mt-0.5 text-[11px] text-[#ADA5C0]">
                Career workspace
              </p>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#0D091F]/45 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}

export default Sidebar;