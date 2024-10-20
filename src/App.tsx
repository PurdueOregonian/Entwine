import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Profile from './Profile'
import MainPage from './MainPage'
import Login from './Login/Login'
import Register from './Login/Register'
import RequireAuth from './Login/RequireAuth'
import PersistLogin from './Login/PersistLogin'

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Register" element={<Register />} />
                    <Route element={<PersistLogin />}>
                        <Route element={<RequireAuth /> }>
                            <Route path="/Profile" element={<Profile />} />
                            <Route path="/" element={<MainPage />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
