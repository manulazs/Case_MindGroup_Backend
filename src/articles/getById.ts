import express, { Request, Response } from 'express';
import { db } from '../db';

const router = express.Router();

router.get('/articles/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  db.query('SELECT * FROM articles WHERE id = ?', [id], (err, results: any[]) => {
    if (err) {
      console.error('Erro ao buscar artigo:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }
    res.json(results[0]);
  });
});

export default router;
