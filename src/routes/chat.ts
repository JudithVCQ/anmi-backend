// src/routes/chat.ts
import { Router } from 'express';
import { saveMessageToSheet, getMessagesFromSheet } from '../services/sheets';

const router = Router();

// Guarda un mensaje en el Google Sheet
router.post('/messages', async (req, res) => {
    try {
        const { userId, role, message } = req.body;

        // Aquí puedes aplicar tus reglas de ANMI (no diagnósticos, etc.)
        await saveMessageToSheet({ userId, role, message });

        res.json({ ok: true });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Obtiene los mensajes del Google Sheet
router.get('/messages', async (_req, res) => {
    try {
        const rows = await getMessagesFromSheet();
        res.json({ ok: true, rows });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

export default router;
