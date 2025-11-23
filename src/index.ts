// src/index.ts
import express from 'express';
import chatRoutes from './routes/chat';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/chat', chatRoutes);

app.get('/', (_req, res) => {
    res.send('ANMI backend OK');
});

app.listen(PORT, () => {
    console.log(`✅ Backend ANMI escuchando en http://localhost:${PORT}`);
});
