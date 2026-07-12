import {
  FiBell,
  FiChevronDown,
  FiMenu,
  FiSearch,
} from "react-icons/fi";

function Topbar({
  userName = "Student",
  onOpenSidebar,
}) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[78px] items-center justify-between border-b border-career-border/80 bg-career-background/85 px-5 backdrop-blur-glass sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
          className="career-icon-button lg:hidden"
        >
          <FiMenu className="text-xl" />
        </button>

        <div>
          <span className="career-eyebrow">
            Career workspace
          </span>

          <h1 className="mt-1 font-heading text-2xl font-normal text-career-text">
            Overview
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Search"
          className="career-icon-button hidden sm:grid"
        >
          <FiSearch />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="career-icon-button relative"
        >
          <FiBell />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border border-white bg-career-purple" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-button border border-career-border bg-white/75 p-1 pr-3"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#A48AF3] to-[#6042BF] text-sm font-semibold text-white">
            {userName.charAt(0).toUpperCase()}
          </span>

          <span className="hidden max-w-28 truncate text-sm font-medium text-career-text sm:block">
            {userName.split(" ")[0]}
          </span>

          <FiChevronDown className="hidden text-sm text-career-muted sm:block" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;