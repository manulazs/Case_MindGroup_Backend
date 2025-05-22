import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { db } from '../db';

const router = express.Router();

// GET /profile — Buscar perfil completo
router.get('/profile', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;

  db.query(
    'SELECT id, name, surname, email, avatar FROM users WHERE id = ?', 
    [user.id], 
    (err, results: any) => {
      if (err) {
        console.error('Erro ao buscar perfil:', err);
        return res.status(500).json({ message: 'Erro no servidor' });
      }
      if (!results || results.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json({ user: results[0] });
    }
  );
});

// PUT /profile — Atualizar perfil
router.put('/profile', authenticateToken, (req: Request, res: Response) => {
  const { name, surname, email, avatar } = req.body;
  const user = (req as any).user;

  if (!name || !surname || !email || !avatar) {
    res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    return;
  }

  db.query(
    'UPDATE users SET name = ?, surname = ?, email = ?, avatar = ? WHERE id = ?', 
    [name, surname, email, avatar, user.id], 
    (err) => {
      if (err) {
        console.error('Erro ao atualizar perfil:', err);
        return res.status(500).json({ message: 'Erro no servidor ao atualizar' });
      }

      // Opcional: buscar novamente os dados atualizados
      db.query(
        'SELECT id, name, surname, email, avatar FROM users WHERE id = ?', 
        [user.id], 
        (err, results: any) => {
          if (err) {
            console.error('Erro ao buscar perfil atualizado:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
          }
          res.json({ message: 'Perfil atualizado!', user: results[0] });
        }
      );
    }
  );
});

export default router;
