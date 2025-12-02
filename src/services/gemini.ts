import { VertexAI } from "@google-cloud/vertexai";

const PROJECT_ID = process.env.GCP_PROJECT_ID!;
const LOCATION = "us-central1";
const DATASTORE_ID = process.env.GCP_DATASTORE_ID!;

// Cliente del modelo Gemini
const vertex = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
});

// Cliente de Vertex AI Search (DataStore)
const searchClient = new VertexAISearchClient();


// ------------------------------------------------------------
// 1️⃣ Buscar en el Data Store
// ------------------------------------------------------------
async function searchInDocs(query: string): Promise<string> {
  try {
    const [response] = await searchClient.search({
      dataStore: DATASTORE_ID,
      query: { query },
    });

    if (!response.results || response.results.length === 0) {
      return "";
    }

    // Concatenamos los chunks relevantes
    const context = response.results
      .map((r) => r.document?.derivedStructData?.content || "")
      .join("\n\n");

    return context;
  } catch (err) {
    console.error("❌ Error buscando en DataStore:", err);
    return "";
  }
}


// ------------------------------------------------------------
// 2️⃣ Preguntar a Gemini usando el contexto recuperado
// ------------------------------------------------------------
export async function askGeminiWithDocs(question: string): Promise<string> {
  try {
    const context = await searchInDocs(question);

    const generativeModel = vertex.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

    const systemPrompt =
      context.length > 0
        ? "Eres un asistente experto en anemia y nutrición infantil. Responde únicamente usando la información encontrada en los documentos."
        : "No encontraste información relevante en los documentos. Responde: 'No tengo información en los documentos para responder esta pregunta.'";

    const finalPrompt =
      context.length > 0
        ? `Contexto recuperado de los documentos:\n${context}\n\nPregunta: ${question}`
        : question;

    const result = await generativeModel.generateContent({
      contents: [
        {
          role: "system",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "user",
          parts: [{ text: finalPrompt }],
        },
      ],
    });

    return (
      result.response.candidates?.[0].content.parts?.[0].text ??
      "No pude generar una respuesta válida."
    );
  } catch (err) {
    console.error("❌ Error consultando Gemini:", err);
    return "Ocurrió un error interno al generar la respuesta.";
  }
}
