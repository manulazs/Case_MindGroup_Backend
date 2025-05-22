import express, { Request, Response } from 'express';
import { authenticateToken } from './middleware/authMiddleware';

const router = express.Router();

router.get('/profile', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user; // contém id e email do token
  res.json({ user });
});

export default router;
// O código acima define uma rota GET /profile que retorna as informações do usuário autenticado.
// Ele utiliza o middleware authenticateToken para verificar se o token JWT é válido.
// Se o token for válido, ele retorna as informações do usuário; caso contrário, retorna um erro 401 (não autorizado).
