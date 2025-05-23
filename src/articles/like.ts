import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { db } from '../db';

const router = express.Router();

router.patch('/articles/:id/like', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  // Verifica se já curtiu
  db.query(
    'SELECT * FROM likes WHERE user_id = ? AND article_id = ?',
    [user.id, id],
    (err, results: any[]) => {
      if (err) {
        console.error('Erro ao verificar like:', err);
        return res.status(500).json({ message: 'Erro no servidor' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Você já curtiu este artigo.' });
      }

      // Não curtiu ainda → registra like
      db.query(
        'INSERT INTO likes (user_id, article_id) VALUES (?, ?)',
        [user.id, id],
        (err) => {
          if (err) {
            console.error('Erro ao registrar like:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
          }

          // Incrementa o contador na tabela de artigos
          db.query(
            'UPDATE articles SET likes = likes + 1 WHERE id = ?',
            [id],
            (err) => {
              if (err) {
                console.error('Erro ao atualizar likes:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
              }
              res.json({ message: 'Like registrado com sucesso!' });
            }
          );
        }
      );
    }
  );
});

export default router;
