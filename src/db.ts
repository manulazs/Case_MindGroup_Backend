import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});
// O código acima configura a conexão com o banco de dados MySQL usando as variáveis de ambiente definidas no arquivo .env.
// Ele utiliza o pacote mysql2 para criar a conexão e exporta a instância da conexão para ser utilizada em outras partes do aplicativo.
// A conexão é estabelecida assim que o módulo é carregado, e uma mensagem de sucesso ou erro é exibida no console.
// O banco de dados é acessado através da variável db exportada, que pode ser utilizada para executar consultas SQL.