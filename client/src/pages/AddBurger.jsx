import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'

function AddBurger() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', description: '', price: '', image: '', category: 'Классические',
  })

  const [error, setError] = useState('')

  async function addProduct(event) {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Не удалось добавить бургер')

      navigate('/')
    } catch (error) {
        setError(error.message)
    }
  }

  return (
    <div className="app">
        <Header />
        <main className="add-page">
            <Link to="/" className="back-link">← Вернуться в меню</Link>

            <div className="add-card">
            <span className="section-label">НОВАЯ ПОЗИЦИЯ</span>
            <h1>Добавить бургер 🍔</h1>

            <form onSubmit={addProduct} className="product-form">
                <input required placeholder="Наименование бургера..." value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} />
                
                <textarea required placeholder="Расскажи, что входит в бургер..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} />

                <input required type="number" min="0" step="0.01" placeholder="Цена (₽)..."
                    value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />

                <input required type="text" placeholder="Ссылка на изображение..."
                    value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />

                <label>
                Категория
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Классические</option>
                    <option>С сыром</option>
                    <option>Фирменные</option>
                    <option>С курицей</option>
                    <option>Острые</option>
                    <option>Вегетарианские</option>
                </select>
                </label>

                {error && <p className="error">{error}</p>}

                <button type="submit" className="submit-button">Добавить в меню →</button>
            </form>
            </div>
        </main>
        </div>
    )
}

export default AddBurger