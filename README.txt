📌 Integración: Gemini 2.5 + Documentos (Vertex AI Search) – Backend Node + TypeScript

Este backend usa Gemini 2.5 Pro y un DataStore de Vertex AI Search (Discovery Engine) para responder preguntas basadas en documentos (PDFs, guías, artículos, etc).

📦 1. Instalación de dependencias

npm install express dotenv
npm install @google-cloud/vertexai
npm install @google-cloud/discoveryengine
npm install typescript ts-node @types/node @types/express --save-dev


Si usas pnpm:

pnpm add express dotenv @google-cloud/vertexai @google-cloud/discoveryengine
pnpm add -D typescript ts-node @types/node @types/express






📁 2. Estructura recomendada del proyecto
ANMI-BACKEND/
│
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── routes/
│   │   └── chat.ts
│   ├── services/
│   │   ├── gemini.ts
│   │   └── sheets.ts
│   ├── index.ts
│
├── .env
├── .gitignore
├── google-key.json
├── package.json
├── tsconfig.json







🔑 3. Credenciales y Variables de Entorno (.env)

Crea un archivo .env en la raíz:

# Google Cloud
GCP_PROJECT_ID=mi-proyecto-12345
GOOGLE_APPLICATION_CREDENTIALS=./google-key.json

# ID del DataStore creado en Discovery Engine
GCP_DATASTORE_ID=abc123






🔐 4. Configurar credenciales Google Cloud

Descargar tu clave de servicio JSON:

Google Cloud Console →
IAM & Admin → Service Accounts → Keys → Create Key

Guárdala como:

google-key.json


⚠ Importante:

Agrega esto a .gitignore:

google-key.json