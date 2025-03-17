import React,{useEffect,useState} from 'react'
import Navbar from "./components/Navbar"
import './index.css'
import {useSelector,useDispatch} from "react-redux"
import { checkAuth } from './redux/features/user.slice'
import { Routes,Route,Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import HomePage from './pages/HomePage'
import Sidebar from "./components/Sidebar";
import Upload from "./pages/Upload"
import WatchPage from "./pages/WatchPage"
import SearchPage from "./pages/SearchPage"
import ProfilePage from './pages/ProfilePage'
import "./App.css"
function App() {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(x=>!x);
  };
  useEffect(()=>{
    dispatch(checkAuth())
  },[])
  const {user} = useSelector(state=>state.user)
  // const user = true
  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar}/>
      <div className="flex-1">
        <Navbar toggleSidebar={toggleSidebar} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watch/:videoId" element={<WatchPage />} />
          <Route path="search/:searchQuery" element={<SearchPage/>} />
          <Route path="/upload" element={user?<Upload />:<Navigate to="/"/>} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  )
}

export default App
