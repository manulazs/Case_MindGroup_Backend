import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { db } from '../db';

const router = express.Router();

router.post('/articles', authenticateToken, (req: Request, res: Response) => {
  const { title, image, text } = req.body;
  const user = (req as any).user;

  if (!title || !text) {
    res.status(400).json({ message: 'Título e texto são obrigatórios' });
    return 
  }

  db.query(
    'INSERT INTO articles (title, image, text, user_id) VALUES (?, ?, ?, ?)',
    [title, image, text, user.id],
    (err) => {
      if (err) {
        console.error('Erro ao criar artigo:', err);
        return res.status(500).json({ message: 'Erro no servidor' });
      }
      res.status(201).json({ message: 'Artigo criado com sucesso!' });
    }
  );
});

export default router;

// o código acima define uma rota POST /articles que permite a criação de um novo artigo.
// Ele utiliza o middleware authenticateToken para verificar se o token JWT é válido.
//// Se o token for válido, ele extrai as informações do usuário do token e verifica se o título e o texto do artigo estão presentes no corpo da requisição.
// Se não estiverem, retorna um erro 400 (solicitação inválida).
// Se o título e o texto estiverem presentes, ele insere o novo artigo no banco de dados, associando-o ao ID do usuário autenticado.
// Se a inserção for bem-sucedida, retorna uma mensagem de sucesso; caso contrário, retorna um erro 500 (erro no servidor).
