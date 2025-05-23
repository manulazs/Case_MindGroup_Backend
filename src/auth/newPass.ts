import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db';

const router = express.Router();

router.post('/newpass', (req: Request, res: Response) => {
  const { newPassword, email } = req.body;

  if (!newPassword || !email) {
    res.status(400).json({ message: 'Nova senha e email são obrigatórios' });
    return  
  }

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao criptografar:', err);
      return res.status(500).json({ message: 'Erro ao criptografar senha' });
    }

    db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (err, result: any) => {
      if (err) {
        console.error('Erro ao atualizar senha:', err);
        return res.status(500).json({ message: 'Erro no servidor ao atualizar senha' });
      }
      if (result && result.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.status(200).json({ message: 'Senha atualizada com sucesso!' });
    });
  });
});

export default router;
