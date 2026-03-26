import './global.css'
import { ThemeSwitch } from './components/themeSwitcher/ThemeSwitcher'
import { Route, Routes } from 'react-router'
import { Dashboard } from './components/Dashboard'
import { Statistic } from './components/Statistic'
import { AddBill } from './components/AdBill'
import { useEffect, useState } from 'react'
import { Filter } from './components/Filter'
import { LoginPopup } from './components/LoginPopup'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated, logout } = useAuth();
  const [currentTime, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timeIntervalId = setInterval(() => {
      setTime(new Date());
    }, 1000)

    return () => {
      clearInterval(timeIntervalId);
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="w-screen min-h-screen bg-[var(--bg)]">
        <LoginPopup />
      </div>
    );
  }

  return (
    <>
      <div className="w-screen min-h-screen bg-[var(--bg)]">
        <div className="min-h-screen px-[10vw] py-[2.5vh] flex flex-col">
          <div
            className="bg-[var(--btn)] mb-4 p-4 rounded-xl grid sm:grid-cols-[1fr_1fr_1fr] sm:grid-rows-1 grid-cols-[1fr] grid-rows-2 items-center text-center min-h-20"
          >
            <p className="hidden sm:flex sm:flex-nowrap text-sm opacity-80 text-left overflow-visible">
              Time: {new Intl.DateTimeFormat('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              }).format(currentTime)}
            </p>


            <h1 className="text-center text-xl block">
              Sổ Thơ Nụ
            </h1>


            <div className="flex flex-row items-center justify-center sm:justify-end gap-3">
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 rounded-lg bg-(--clr) hover:scale-105 transition-all cursor-pointer"
              >
                Đăng xuất
              </button>
              <ThemeSwitch />
            </div>
          </div>

          <nav className="bg-[var(--btn)] mb-4 p-4 rounded-xl grid lg:grid-cols-4 lg:grid-rows-1 sm:grid-cols-1 sm:grid-rows-3 grid-cols-[1fr] grid-rows-3 gap-2.5 items-center text-center min-h-20">
            <a className='pt-2.5 pb-2.5 rounded-xl bg-(--clr) hover:scale-105 transition-all' href="/dashboard">Dashboard</a>
            <a className='pt-2.5 pb-2.5 rounded-xl bg-(--clr) hover:scale-105 transition-all' href="/add-bill">Thêm nợ</a>
            <a className='pt-2.5 pb-2.5 rounded-xl bg-(--clr) hover:scale-105 transition-all' href="/statistic">Thống kê nợ</a>
            <a className='pt-2.5 pb-2.5 rounded-xl bg-(--clr) hover:scale-105 transition-all' href="/filter">Filter</a>
          </nav>

          <Routes>
            <Route path='/dashboard' element={<Dashboard linkQuery='' />}></Route>
            <Route path="/add-bill" element={<AddBill />}></Route>
            <Route path="/statistic" element={<Statistic />}></Route>
            <Route path='/filter' element={<Filter />}></Route>
          </Routes>
        </div>
      </div>
    </>)
}

export default App
