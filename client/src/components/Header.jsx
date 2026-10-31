import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        BURGER<span>HOUSE</span>
        <span className="logo-icon">🍔</span>
      </Link>

      <nav>
        <Link to="/">Главная</Link>
        <Link to="/add" className="add-link">
          + Добавить бургер
        </Link>
      </nav>
    </header>
  )
}

export default Header