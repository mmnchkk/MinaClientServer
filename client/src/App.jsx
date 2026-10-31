import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AddBurger from './pages/AddBurger'
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddBurger />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App