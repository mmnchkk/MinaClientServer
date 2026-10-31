import { NextResponse } from 'next/server'
import pool from '../../../lib/db'

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY id DESC'
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Ошибка получения товаров:', error)

    return NextResponse.json(
      { error: 'Не удалось получить товары' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { name, description, price, image, category } =
      await request.json()

    if (
      !name?.trim() ||
      !description?.trim() ||
      price === undefined ||
      price === null ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      !image?.trim()
    ) {
      return NextResponse.json(
        { error: 'Проверьте название, описание, цену и изображение' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, image, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name.trim(),
        description.trim(),
        Number(price),
        image.trim(),
        category?.trim() || 'Компьютерная техника',
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Ошибка добавления товара:', error)

    return NextResponse.json(
      { error: 'Не удалось добавить товар' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    const productId = Number(id)

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { error: 'Некорректный идентификатор товара' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [productId]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Товар удалён' })
  } catch (error) {
    console.error('Ошибка удаления товара:', error)

    return NextResponse.json(
      { error: 'Не удалось удалить товар' },
      { status: 500 }
    )
  }
}