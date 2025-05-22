import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    (req as any).user = user;
    next();
  });
};
// O código acima define um middleware chamado authenticateToken que verifica se o token JWT é válido.
// Ele extrai o token do cabeçalho Authorization da requisição e o verifica usando a chave secreta definida em .env.
// Se o token for válido, ele adiciona as informações do usuário à requisição e chama next() para continuar o processamento da requisição.
// Caso contrário, ele retorna um erro 401 (não autorizado) ou 403 (proibido).

