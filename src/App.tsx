import './App.css'
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom'
import Profile from './pages/Profile'
import MainPage from './pages/MainPage'
import Login from './Auth/Login'
import Register from './Auth/Register'
import RequireAuth from './Auth/RequireAuth'
import PersistLogin from './Auth/PersistLogin'
import Search from './pages/Search'
import NotFoundPage from './pages/NotFoundPage'
import SetupProfile from './pages/SetupProfile'
import OtherUserProfile from './pages/OtherUserProfile'
import NavHeader from './components/NavHeader'
import { StaticDataProvider } from './StaticDataContext'

function WithNavHeader() {
    return (
        <>
            <NavHeader />
            <Outlet />
        </>
    );
}

function WithStaticData() {
    return (
        <>
            <StaticDataProvider>
                <Outlet />
            </StaticDataProvider>
        </>
    );
}

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Register" element={<Register />} />
                    <Route element={<PersistLogin />}>
                        <Route element={<RequireAuth />}>
                            <Route element={<WithStaticData />}>
                                <Route path="/SetupProfile" element={<SetupProfile />} />
                                <Route element={<WithNavHeader />}>
                                    <Route path="/Profile" element={<Profile />} />
                                    <Route path="/Profile/:usernameFromRoute" element={<OtherUserProfile />} />
                                    <Route path="/Search" element={<Search />} />
                                    <Route path="/" element={<MainPage />} />
                                    <Route path="*" element={<NotFoundPage />} />
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
