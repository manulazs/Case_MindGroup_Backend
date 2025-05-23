import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { db } from '../db';

const router = express.Router();

router.post('/articles/:id/toggle-like', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  db.query('SELECT * FROM likes WHERE user_id = ? AND article_id = ?', [user.id, id], (err, results: any[]) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor' });

    if (Array.isArray(results) && results.length > 0) {
      // Descurtir
      db.query('DELETE FROM likes WHERE user_id = ? AND article_id = ?', [user.id, id], (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao descurtir' });

        db.query('UPDATE articles SET likes = likes - 1 WHERE id = ?', [id]);
        return res.json({ message: 'Descurtido' });
      });
    } else {
      // Curtir
      db.query('INSERT INTO likes (user_id, article_id) VALUES (?, ?)', [user.id, id], (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao curtir' });

        db.query('UPDATE articles SET likes = likes + 1 WHERE id = ?', [id]);
        return res.json({ message: 'Curtido' });
      });
    }
  });
});

export default router;
