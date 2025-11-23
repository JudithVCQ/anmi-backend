// src/services/sheets.ts
export interface ChatMessage {
    userId: string;
    role: 'user' | 'assistant';
    message: string;
}

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL as string;

if (!APPS_SCRIPT_URL) {
    console.error('⚠️ Falta APPS_SCRIPT_URL en .env');
}

export async function saveMessageToSheet(msg: ChatMessage) {
    const body = {
        action: 'saveMessage',
        payload: msg,
    };

    const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`Apps Script error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
}

export async function getMessagesFromSheet() {
    const body = { action: 'getMessages' };

    const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`Apps Script error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.rows as Array<{
        timestamp: string;
        userId: string;
        role: string;
        message: string;
    }>;
}
