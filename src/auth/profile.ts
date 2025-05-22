import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { db } from '../db';

const router = express.Router();

router.get('/profile', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user; // contém id e email do token
  res.json({ user });
});

router.put('/profile', authenticateToken, (req: Request, res: Response) => {
  const { name, surname, email } = req.body;
  const user = (req as any).user;

  db.query('UPDATE users SET name = ?, surname = ?, email = ? WHERE id = ?', 
    [name, surname, email, user.id], (err) => {
      if (err) return res.status(500).json({ message: 'Erro no servidor' });
      res.json({ message: 'Perfil atualizado!' });
  });
});


export default router;
// O código acima define uma rota GET /profile que retorna as informações do usuário autenticado.
// Ele utiliza o middleware authenticateToken para verificar se o token JWT é válido.
// Se o token for válido, ele retorna as informações do usuário; caso contrário, retorna um erro 401 (não autorizado).
