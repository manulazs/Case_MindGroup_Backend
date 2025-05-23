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
import articleListRouter from './articles/list';
import articleLikeRouter from './articles/like';
import articleByIdRouter from './articles/getById';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', articleCreateRouter);

app.use('/', articleLikeRouter);

app.use('/auth', loginRouter);

app.use('/auth', profileRouter);

app.use('/auth', newPassRouter);

app.use('/', articleListRouter);

app.use('/', articleByIdRouter);

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
