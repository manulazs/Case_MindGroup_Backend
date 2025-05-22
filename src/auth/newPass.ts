import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/newpass', authenticateToken, (req: Request, res: Response) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    res.status(400).json({ message: 'Nova senha é obrigatória' });
    return 
  }

  const user = (req as any).user;

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


//O código acima define uma rota POST /auth/newpass que permite
// ao usuário autenticado atualizar sua senha.
// Ele utiliza o middleware authenticateToken para verificar se o token JWT é válido.
// Se o token for válido, ele criptografa a nova senha usando bcrypt e atualiza o banco de dados.
// Se ocorrer algum erro durante o processo, uma mensagem de erro apropriada é retornada.
// Caso contrário, uma mensagem de sucesso é retornada.
// O código utiliza o bcrypt para criptografar a nova senha antes de armazená-la no banco de dados.
// O banco de dados é acessado através da variável db importada do módulo db.
// A rota é exportada como um módulo para ser utilizada em outras partes do aplicativo.