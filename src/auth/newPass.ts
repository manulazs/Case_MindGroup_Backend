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

//o código acima define uma rota POST /auth/newpass que permite
// ao usuário autenticado atualizar sua senha.
//  Ele utiliza o middleware authenticateToken para verificar se o token JWT é válido.
//  Se o token for válido, ele verifica se o email fornecido no corpo da requisição confere com o email do usuário autenticado.
//  Se não conferir, retorna um erro 403 (proibido).
//  Se o email conferir, ele criptografa a nova senha usando bcrypt e atualiza a senha no banco de dados.
//  Se a atualização for bem-sucedida, retorna uma mensagem de sucesso; caso contrário, retorna um erro 500 (erro no servidor).
//  O código também lida com erros de criptografia e atualização de senha, retornando mensagens apropriadas em caso de falha.
//  O middleware authenticateToken é responsável por verificar a validade do token JWT e extrair as informações do usuário dele.
//  O código utiliza o bcrypt para criptografar a nova senha antes de armazená-la no banco de dados, garantindo que as senhas sejam armazenadas de forma segura.
//  O código também utiliza o db.query para executar consultas SQL no banco de dados MySQL, permitindo a atualização da senha do usuário.
//  O código é um exemplo de como implementar uma funcionalidade de atualização de senha em uma API RESTful usando Node.js, Express, MySQL e bcrypt.
