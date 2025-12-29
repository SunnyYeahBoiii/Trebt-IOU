import './global.css'
import { ThemeSwitch } from './components/themeSwitcher/ThemeSwitcher'
import { Route, Routes } from 'react-router'
import { Dashboard } from './components/Dashboard'
import { Statistic } from './components/Statistic'
import { AddBill } from './components/AdBill'

function App() {
  return (
  <>
      <div className="w-screen min-h-screen bg-[var(--bg)]">
      <div className="min-h-screen px-[10vw] py-[2.5vh]">
        <div
          className="bg-[var(--btn)] mb-4 p-4 rounded-xl grid sm:grid-cols-[auto_1fr_auto] sm:grid-rows-1 grid-cols-[1fr] grid-rows-2 items-center text-center min-h-20"
        >
            <p className="hidden sm:block text-sm opacity-80">
                Time: 36:36:36
            </p>


            <h1 className="text-center text-xl font-bold block">
                Sổ Thơ Nụ
            </h1>

        
            <div className="flex flex-row justify-center">
                <ThemeSwitch />
            </div>
        </div>

        <nav className="bg-[var(--btn)] mb-4 p-4 rounded-xl grid lg:grid-cols-4 lg:grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 grid-cols-[1fr] grid-rows-4 gap-2.5 items-center text-center min-h-20">
          <a className='pt-2.5 pb-2.5 rounded-xl bg-(--clr) hover:scale-105 transition-all' href = "/dashboard">Dashboard</a>
          <a className='pt-2.5 pb-2.5 rounded-xl bg-(--clr) hover:scale-105 transition-all' href = "/add-bill">Thêm nợ</a>
          <a className='pt-2.5 pb-2.5 rounded-xl bg-(--clr) hover:scale-105 transition-all' href = "/statistic">Thống kê nợ</a>
          <a className='pt-2.5 pb-2.5 rounded-xl bg-(--clr) hover:scale-105 transition-all' href = "/filter">Filter & Sort</a>
        </nav>

        <Routes>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path="/add-bill" element={<AddBill/>}></Route>
          <Route path="/statistic" element = {<Statistic/>}></Route>
          <Route path="/filter"></Route>
        </Routes>
      </div>
    </div>
  </>)
}

export default App
