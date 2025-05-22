import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { db } from './db';
import { Request, Response } from 'express';
import loginRouter from './auth/login';
import profileRouter from './auth/profile';
import newPassRouter from './auth/newPass';
import articleCreateRouter from './articles/create';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', articleCreateRouter);

app.use('/auth', loginRouter);

app.use('/auth', profileRouter);

app.use('/auth', newPassRouter);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.post('/auth/register', (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    return; 
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results: any) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Erro ao criptografar:', err);
        return res.status(500).json({ message: 'Erro ao criptografar senha' });
      }

      db.query(
        'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
        [name, surname, email, hashedPassword],
        (err) => {
          if (err) {
            console.error('Erro ao inserir:', err);
            return res.status(500).json({ message: 'Erro no servidor ao inserir' });
          }

          res.status(201).json({ message: 'Usuário registrado com sucesso!' });
        }
      );
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// O código acima define um servidor Express que escuta na porta especificada (ou 3000 por padrão).
// Ele utiliza o middleware cors para permitir requisições de diferentes origens e express.json() para analisar o corpo das requisições em JSON.
// O servidor possui uma rota GET na raiz (/) que retorna uma mensagem de sucesso e uma rota POST em /auth/register para registrar novos usuários.
// A rota de registro verifica se todos os campos obrigatórios estão presentes, se o email já está cadastrado e, em seguida, criptografa a senha usando bcrypt antes de armazenar os dados no banco de dados MySQL.
// Se o registro for bem-sucedido, retorna uma mensagem de sucesso; caso contrário, retorna mensagens de erro apropriadas.
// O servidor também importa e utiliza o módulo de login (loginRouter) para gerenciar autenticação e login de usuários.