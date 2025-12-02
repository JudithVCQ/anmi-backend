import { VertexAI } from "@google-cloud/vertexai";
import { SearchServiceClient } from "@google-cloud/discoveryengine";

const PROJECT_ID = process.env.GCP_PROJECT_ID!;
const LOCATION = "global"; // Discovery Engine SIEMPRE usa "global"
const DATASTORE_ID = process.env.GCP_DATASTORE_ID!;

// Cliente de Gemini
const vertex = new VertexAI({
  project: PROJECT_ID,
  location: "us-central1",
});

// Cliente oficial de Vertex AI Search
const searchClient = new SearchServiceClient();


// ------------------------------------------------------------
// 1️⃣ Buscar en el Data Store
// ------------------------------------------------------------
async function searchInDocs(query: string): Promise<string> {
  try {
    const request = {
      servingConfig: `projects/${PROJECT_ID}/locations/${LOCATION}/dataStores/${DATASTORE_ID}/servingConfigs/default_config`,
      query,
      pageSize: 5,
    };

    const [response] = await searchClient.search(request);

    const results = (response as any).results ?? [];

    if (results.length === 0) return "";

    const context = results
      .map((r: any) => r.document?.structData?.content || "")
      .join("\n\n");

    return context;
  } catch (err) {
    console.error("❌ Error buscando en DataStore:", err);
    return "";
  }
}



// ------------------------------------------------------------
// 2️⃣ Consultar Gemini con contexto
// ------------------------------------------------------------
export async function askGeminiWithDocs(question: string): Promise<string> {
  const context = await searchInDocs(question);

  const generativeModel = vertex.getGenerativeModel({
    model: "gemini-2.5-pro",
  });

  const systemPrompt =
    context.length > 0
      ? "Responde únicamente usando el contexto de los documentos."
      : "No encontré información relevante en los documentos.";

  const finalPrompt =
    context.length > 0
      ? `Contexto:\n${context}\n\nPregunta: ${question}`
      : question;

  const response = await generativeModel.generateContent({
    contents: [
      { role: "system", parts: [{ text: systemPrompt }] },
      { role: "user", parts: [{ text: finalPrompt }] },
    ],
  });

  return (
    response.response.candidates?.[0].content.parts?.[0].text ??
    "No pude generar una respuesta."
  );
}
