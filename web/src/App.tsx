import './global.css'
import { ThemeSwitch } from './components/themeSwitcher/ThemeSwitcher'
import { NavLink, Route, Routes } from 'react-router'
import { Dashboard } from './components/Dashboard'
import { Statistic } from './components/Statistic'
import { AddBill } from './components/AdBill'
import { Filter } from './components/Filter'
import { LoginPopup } from './components/LoginPopup'
import { useAuth } from './hooks/useAuth'
import { Clock } from './components/Clock'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/add-bill', label: 'Thêm nợ' },
  { href: '/statistic', label: 'Thống kê' },
  { href: '/filter', label: 'Lọc nợ' },
]

function App() {
  const { isAuthenticated, logout, userName } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-(--bg)">
        <LoginPopup />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-(--bg)">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
          <header className="rounded-lg border border-(--border) bg-(--surface) px-4 py-3 shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-center justify-end gap-2">
                <div className="hidden rounded-md border border-(--border) bg-(--surface-raised) px-3 py-2 text-sm text-(--text-muted) sm:block">
                  <Clock />
                </div>
                {userName && (
                  <span className="rounded-md bg-(--ac-state) px-3 py-2 text-sm font-semibold text-(--text)">
                    {userName}
                  </span>
                )}
                <ThemeSwitch />
              <button
                onClick={logout}
                  className="min-h-10 rounded-md border border-(--border) bg-(--surface-raised) px-3 py-2 text-sm font-semibold text-(--text) transition-colors hover:bg-(--clr) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus)"
              >
                Đăng xuất
              </button>
            </div>
          </header>

          <nav className="grid grid-cols-2 gap-2 rounded-lg border border-(--border) bg-(--surface) p-1.5 shadow-[var(--shadow-soft)] sm:grid-cols-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus) ${
                    isActive
                      ? 'bg-(--btn) text-[oklch(0.98_0.006_214)]'
                      : 'text-(--text-muted) hover:bg-(--clr) hover:text-(--text)'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <main className="flex-1 pb-6">
            <Routes>
              <Route path="/" element={<Dashboard linkQuery="" />}></Route>
              <Route path="/dashboard" element={<Dashboard linkQuery="" />}></Route>
              <Route path="/add-bill" element={<AddBill />}></Route>
              <Route path="/statistic" element={<Statistic />}></Route>
              <Route path="/filter" element={<Filter />}></Route>
            </Routes>
          </main>
        </div>
      </div>
    </>)
}

export default App
