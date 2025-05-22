import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/newpass', authenticateToken, (req: Request, res: Response) => {
  const { newPassword, email } = req.body;

  if (!newPassword || !email) {
    res.status(400).json({ message: 'Nova senha e email são obrigatórios' });
    return;
  }

  const user = (req as any).user;

  // Verifica se o email informado confere com o do token
  if (email !== user.email) {
    res.status(403).json({ message: 'Email não confere com o usuário autenticado' });
    return;
  }

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao criptografar:', err);
      return res.status(500).json({ message: 'Erro ao criptografar senha' });
    }

    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id], (err) => {
      if (err) {
        console.error('Erro ao atualizar senha:', err);
        return res.status(500).json({ message: 'Erro no servidor ao atualizar senha' });
      }

      res.status(200).json({ message: 'Senha atualizada com sucesso!' });
    });
  });
});

export default router;
