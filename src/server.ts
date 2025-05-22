import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { db } from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Rota de registro
app.post('/auth/register', (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  // Verifica se usuário já existe
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Erro ao consultar:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Criptografa senha
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Erro ao criptografar:', err);
        return res.status(500).json({ message: 'Erro ao criptografar senha' });
      }

      // Insere usuário
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
