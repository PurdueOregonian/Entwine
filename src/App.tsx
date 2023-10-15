import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CreateProfile from './CreateProfile'
import MainPage from './MainPage'

function App() {
  return (
      <Router>
          <header className="App-header">
              <h1>Friends</h1>
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
  )
}

export default App
