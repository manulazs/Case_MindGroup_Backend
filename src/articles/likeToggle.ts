import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { db } from '../db';

const router = express.Router();

router.post('/articles/:id/like-toggle', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;

  // Verifica se já curtiu
  db.query('SELECT * FROM likes WHERE user_id = ? AND article_id = ?', [user.id, id], (err, results: any[]) => {
    if (err) {
      console.error('Erro ao verificar like:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (results.length > 0) {
      // Já curtiu, então remove
      db.query('DELETE FROM likes WHERE user_id = ? AND article_id = ?', [user.id, id], (err) => {
        if (err) {
          console.error('Erro ao remover like:', err);
          return res.status(500).json({ message: 'Erro ao remover like' });
        }
        // Decrementa contador
        db.query('UPDATE articles SET likes = likes - 1 WHERE id = ?', [id], (err) => {
          if (err) {
            console.error('Erro ao atualizar likes:', err);
            return res.status(500).json({ message: 'Erro ao atualizar likes' });
          }
          res.json({ message: 'Like removido!', liked: false });
        });
      });
    } else {
      // Não curtiu, então adiciona
      db.query('INSERT INTO likes (user_id, article_id) VALUES (?, ?)', [user.id, id], (err) => {
        if (err) {
          console.error('Erro ao adicionar like:', err);
          return res.status(500).json({ message: 'Erro ao adicionar like' });
        }
        // Incrementa contador
        db.query('UPDATE articles SET likes = likes + 1 WHERE id = ?', [id], (err) => {
          if (err) {
            console.error('Erro ao atualizar likes:', err);
            return res.status(500).json({ message: 'Erro ao atualizar likes' });
          }
          res.json({ message: 'Like adicionado!', liked: true });
        });
      });
    }
  });
});

export default router;
