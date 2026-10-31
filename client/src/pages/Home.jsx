import { useEffect, useState } from 'react'
import Header from '../components/Header'

function Home() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('Все')
    const [sort, setSort] = useState('default')

    async function loadProducts() {
        try {
        setError('')
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Ошибка загрузки бургеров')

        const data = await response.json()
        setProducts(data) } catch (error) {
        setError(error.message) } finally { setLoading(false) }
    }

    useEffect(() => { loadProducts() }, [])

    async function deleteProduct(id) {
        if (!confirm('Удалить этот бургер?')) return

        try {
        const response = await fetch('/api/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Ошибка удаления')

        await loadProducts() } catch (error) 
        { alert(error.message) }
    }

    const categories = ['Все', ...new Set(products.map(product => product.category))]

    const filteredProducts = products
        .filter(product => {
        const text = `${product.name} ${product.description}`.toLowerCase()
        const matchesSearch = text.includes(search.toLowerCase())
        const matchesCategory = category === 'Все' || product.category === category

        return matchesSearch && matchesCategory
        })
        .sort((a, b) => {
            if (sort === 'price-asc') return Number(a.price) - Number(b.price)
            if (sort === 'price-desc') return Number(b.price) - Number(a.price)
        return 0})

    return (
        <div className="app">
        <Header />
            <main className="main" id="catalog">
                <div className="section-heading">
                <div>
                    <h2>БУРГЕРЫ СПАСУТ МИР</h2>
                </div>
                <span className="product-count">{products.length} позиций</span>
                </div>

                <div className="filters">
                <input type="text" placeholder="🔍 Найти бургер..." value={search}
                    onChange={e => setSearch(e.target.value)} />

                <select value={category} onChange={e => setCategory(e.target.value)}>
                    {categories.map(item => <option key={item} value={item}>{item}</option>)}
                </select>

                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="default">Сортировка</option>
                    <option value="price-asc">Сначала дешевле</option>
                    <option value="price-desc">Сначала дороже</option>
                </select>
                </div>

                {loading && <p>Загружаем меню...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && filteredProducts.length === 0 && (
                <p className="empty">Бургеры не найдены 🍔</p>
                )}

                <section className="products">
                {filteredProducts.map(product => (
                    <article className="product-card" key={product.id}>
                    <div className="image-wrapper">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <span className="category">{product.category}</span>
                    </div>

                    <div className="product-info">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>

                        <div className="product-bottom">
                        <strong>{Number(product.price).toLocaleString('ru-RU')} ₽</strong>
                        <button className="delete-button" onClick={() => deleteProduct(product.id)}>
                            Удалить
                        </button>
                        </div>
                    </div>
                    </article>
                ))}
                </section>
            </main>
        </div>
    )
}

export default Home