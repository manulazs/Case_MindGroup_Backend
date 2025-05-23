import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { db } from '../db';

const router = express.Router();

router.put('/articles/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, text, image } = req.body;
  const user = (req as any).user;

  db.query('SELECT * FROM articles WHERE id = ?', [id], (err, results: any[]) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar artigo' });
    if (!Array.isArray(results) || results.length === 0) return res.status(404).json({ message: 'Artigo não encontrado' });

    const article = results[0];
    if (article.user_id !== user.id) return res.status(403).json({ message: 'Proibido' });

    db.query('UPDATE articles SET title = ?, text = ?, image = ? WHERE id = ?', [title, text, image, id], (err) => {
      if (err) return res.status(500).json({ message: 'Erro ao atualizar' });
      res.json({ message: 'Artigo atualizado com sucesso' });
    });
  });
});

export default router;
