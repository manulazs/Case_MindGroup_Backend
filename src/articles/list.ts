import express, { Request, Response } from 'express';
import { db } from '../db';

const router = express.Router();

router.get('/articles', (req: Request, res: Response) => {
  db.query('SELECT * FROM articles ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Erro ao listar:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }
    res.json(results);
  });
});

export default router;

// o código acima define uma rota GET /articles que lista todos os artigos do banco de dados.
// Ele consulta a tabela de artigos e ordena os resultados pela data de criação em ordem decrescente.
// Se ocorrer um erro durante a consulta, retorna um erro 500 (erro no servidor).
// Caso contrário, retorna os resultados da consulta em formato JSON.
