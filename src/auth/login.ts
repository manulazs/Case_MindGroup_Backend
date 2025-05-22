import express, { Request, Response } from 'express';
import { db } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email e senha são obrigatórios' });
    return 
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results: any) => {
    if (err) {
      console.error('Erro ao consultar:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Erro ao comparar:', err);
        return res.status(500).json({ message: 'Erro no servidor' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Email ou senha inválidos' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      res.json({ message: 'Login realizado com sucesso', token });
    });
  });
});

export default router;

// O código acima define uma rota POST /login que autentica um usuário com base no email e senha fornecidos.
// Ele verifica se o email e a senha estão presentes no corpo da requisição.
// Se não estiverem, retorna um erro 400 (solicitação inválida).
// Em seguida, ele consulta o banco de dados para encontrar o usuário com o email fornecido.
// Se o usuário não for encontrado, retorna um erro 400 (email ou senha inválidos).
// Se o usuário for encontrado, ele compara a senha fornecida com a senha armazenada no banco de dados usando bcrypt.
// Se a senha não corresponder, retorna um erro 400 (email ou senha inválidos).
// Se a senha corresponder, ele gera um token JWT usando a chave secreta definida em .env e retorna o token na resposta.
// O token contém o id e o email do usuário e tem um tempo de expiração de 1 hora.

