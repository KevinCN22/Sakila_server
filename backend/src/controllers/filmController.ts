import { Request, Response } from 'express';
import { getDbPool } from '../database/db';

export const getFilms = async (_req: Request, res: Response) => {
  try {
    const db = getDbPool();
    const [rows] = await db.query('SELECT film_id, title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating FROM film');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener films:', error);
    res.status(500).json({ message: 'Error al obtener films', error });
  }
};
export const getAvailable = async (_req: Request, res: Response) => {
    const db = getDbPool();
  try {
    const [rows] = await db.query(`
      SELECT f.film_id, f.title, COUNT(r.rental_id) AS total_alquileres
      FROM film f
      JOIN inventory i ON f.film_id = i.film_id
      JOIN rental r ON i.inventory_id = r.inventory_id
      GROUP BY f.film_id, f.title
      ORDER BY total_alquileres DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar datos', error });
  }
}