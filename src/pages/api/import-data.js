import { Pool } from 'pg';

// Configuração do banco de dados - segura aqui no servidor
const dbConfig = {
  user: 'postgres',
  host: 'junction.proxy.rlwy.net',
  database: 'railway',
  password: 'WYvDRkkIyEYcbWoBWFNrZpqDVQYwBPUT', 
  port: 47480,
};

const pool = new Pool(dbConfig);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { records } = req.body;
    const results = { success: 0, failed: 0 };

    for (const record of records) {
      try {
        const fields = Object.keys(record);
        const placeholders = fields.map((_, index) => `$${index + 1}`);
        const values = fields.map(field => record[field]);

        const query = `
          INSERT INTO analise (${fields.join(', ')})
          VALUES (${placeholders.join(', ')})
          RETURNING id;
        `;

        const result = await pool.query(query, values);
        results.success++;
      } catch (error) {
        console.error('Erro ao inserir registro:', error);
        results.failed++;
      }
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}