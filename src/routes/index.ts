import express from 'express';
import chatRoutes from './chat';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Aquí montas tus rutas
app.use('/chat', chatRoutes);

app.get('/', (_req, res) => {
    res.send('ANMI backend OK');
});

app.listen(PORT, () => {
    console.log(`✅ Backend ANMI escuchando en http://localhost:${PORT}`);
});
