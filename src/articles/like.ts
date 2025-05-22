import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { db } from '../db';

const router = express.Router();

router.patch('/articles/:id/like', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;

  db.query('UPDATE articles SET likes = likes + 1 WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Erro ao dar like:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }
    res.json({ message: 'Like adicionado!' });
  });
});

export default router;
// // O código acima define uma rota PATCH /articles/:id/like que permite adicionar um "like" a um artigo específico.
// // Ele utiliza o middleware authenticateToken para verificar se o token JWT é válido.
// // Se o token for válido, ele atualiza o número de "likes" do artigo com o ID fornecido na URL.
// // Se a atualização for bem-sucedida, retorna uma mensagem de sucesso; caso contrário, retorna um erro 500 (erro no servidor).
// // O código utiliza o db.query para executar consultas SQL no banco de dados MySQL, permitindo a atualização do número de "likes" do artigo.
