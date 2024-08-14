import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CreateProfile from './CreateProfile'
import MainPage from './MainPage'
import Login from './Login'
import { useState } from 'react'
import Register from './Register'

function App() {
    const [displayLoginModal, setDisplayLoginModal] = useState(false);
    const [displayRegisterModal, setDisplayRegisterModal] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    return (
        <>
            <button onClick={() => setDisplayLoginModal(true)}>Log In</button>
            {displayLoginModal && <Login
                setDisplayModal={setDisplayLoginModal}
                setDisplayRegisterModal={setDisplayRegisterModal}
                setLoggedInUser={setLoggedInUser}
            />}
            {displayRegisterModal && <Register
                setDisplayModal={setDisplayRegisterModal}
            />}
          <Router>
            <header className="App-header">
                <h1>Friends</h1>
                <div className="user-info">
                    <span>{loggedInUser ? `Logged in as ${loggedInUser}` : 'Please log in'}</span>
                </div>
            </header>
            <div className="Menu">
                <a href="/">Home</a>
                <a href="/CreateProfile">Create Profile</a>
            </div>
            <Routes>
                <Route path="/CreateProfile" element={<CreateProfile />} />
                <Route path="/" element={<MainPage />} />
            </Routes>
          </Router>
      </>
  )
}

export default App
