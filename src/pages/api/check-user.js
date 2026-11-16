// pages/api/check-user.js
import { getAuth } from '@clerk/nextjs/server';
import { Client } from 'pg';

const connectionString = process.env.POSTGRES_CONNECTION_STRING;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { userId } = req.body;
  const { user } = await getAuth(req);

  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const client = new Client({
    connectionString: connectionString,
  });

  await client.connect();

  const queryCheck = `
    SELECT * FROM users WHERE clerk_user_id = $1
  `;
  const valuesCheck = [userId];

  try {
    const resCheck = await client.query(queryCheck, valuesCheck);
    if (resCheck.rows.length === 0) {
      const queryInsert = `
        INSERT INTO users (clerk_user_id, email, created_at)
        VALUES ($1, $2, $3)
      `;
      const valuesInsert = [userId, user.emailAddresses[0].emailAddress, new Date()];
      await client.query(queryInsert, valuesInsert);
    }
  } catch (err) {
    console.error('Erro ao verificar/adicionar usuário ao banco de dados:', err);
  } finally {
    await client.end();
  }

  res.status(200).send('User checked/added');
}
