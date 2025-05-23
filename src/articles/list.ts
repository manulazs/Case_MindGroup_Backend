import express, { Request, Response } from 'express';
import { db } from '../db';

const router = express.Router();

router.get('/articles', (req: Request, res: Response) => {
  const sql = `
    SELECT articles.*, users.name AS author_name
    FROM articles
    JOIN users ON articles.user_id = users.id
    ORDER BY articles.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao listar:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }
    res.json(results);
  });
});

export default router;
