import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SYSTEM_PROMPT = `Tu es VulgaTechAfrique, un assistant éducatif spécialisé dans la vulgarisation technologique pour l'Afrique.

Ton rôle :
- Expliquer des concepts technologiques de manière simple et accessible
- Aider les étudiants et professionnels africains à apprendre la programmation, l'IA, et les nouvelles technologies
- Répondre en français de manière claire et pédagogique
- Donner des exemples concrets et pertinents pour le contexte africain
- Encourager et motiver les apprenants

Règles :
- Sois concis mais complet
- Utilise des analogies simples
- Si tu ne sais pas, dis-le honnêtement
- Adapte ton niveau au besoin de l'utilisateur`;

async function sendTelegramMessage(chatId: number, text: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
  });
}

async function getOrCreateConversation(chatId: number, username?: string, firstName?: string, lastName?: string) {
  // Try to get existing conversation
  const { data: existing } = await supabase
    .from("telegram_conversations")
    .select("*")
    .eq("chat_id", chatId)
    .single();

  if (existing) {
    return existing;
  }

  // Create new conversation
  const { data: newConvo, error } = await supabase
    .from("telegram_conversations")
    .insert({
      chat_id: chatId,
      username,
      first_name: firstName,
      last_name: lastName,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }

  return newConvo;
}

async function getConversationHistory(conversationId: string, limit = 10) {
  const { data: messages } = await supabase
    .from("telegram_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (messages || []).reverse();
}

async function saveMessage(conversationId: string, chatId: number, messageId: number, role: string, content: string) {
  await supabase.from("telegram_messages").insert({
    conversation_id: conversationId,
    chat_id: chatId,
    message_id: messageId,
    role,
    content,
  });
}

async function getAIResponse(messages: { role: string; content: string }[]) {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("AI API error:", error);
    throw new Error("Failed to get AI response");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

serve(async (req) => {
  if (req.method === "GET") {
    return new Response("Telegram webhook is active!", { status: 200 });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const update = await req.json();
    console.log("Received update:", JSON.stringify(update));

    // Handle message
    if (update.message && update.message.text) {
      const message = update.message;
      const chatId = message.chat.id;
      const text = message.text;
      const messageId = message.message_id;
      const username = message.from?.username;
      const firstName = message.from?.first_name;
      const lastName = message.from?.last_name;

      // Handle /start command
      if (text === "/start") {
        await sendTelegramMessage(
          chatId,
          `🎓 *Bienvenue sur VulgaTechAfrique !*\n\nJe suis ton assistant éducatif pour apprendre la technologie.\n\n💡 Pose-moi n'importe quelle question sur :\n• La programmation\n• L'intelligence artificielle\n• Les nouvelles technologies\n• Le développement web/mobile\n\nEnvoie simplement ton message pour commencer !`
        );
        return new Response("OK", { status: 200 });
      }

      // Handle /help command
      if (text === "/help") {
        await sendTelegramMessage(
          chatId,
          `🆘 *Aide VulgaTechAfrique*\n\n*Commandes :*\n/start - Démarrer le bot\n/help - Afficher cette aide\n/clear - Effacer l'historique\n\n*Comment m'utiliser :*\nEnvoie simplement ta question et je te répondrai !\n\nExemples :\n• "Qu'est-ce que Python ?"\n• "Comment créer un site web ?"\n• "Explique-moi l'IA"`
        );
        return new Response("OK", { status: 200 });
      }

      // Handle /clear command
      if (text === "/clear") {
        const conversation = await getOrCreateConversation(chatId, username, firstName, lastName);
        await supabase
          .from("telegram_messages")
          .delete()
          .eq("conversation_id", conversation.id);
        
        await sendTelegramMessage(chatId, "🗑️ Historique effacé ! Tu peux recommencer une nouvelle conversation.");
        return new Response("OK", { status: 200 });
      }

      // Get or create conversation
      const conversation = await getOrCreateConversation(chatId, username, firstName, lastName);

      // Save user message
      await saveMessage(conversation.id, chatId, messageId, "user", text);

      // Get conversation history
      const history = await getConversationHistory(conversation.id);

      // Get AI response
      const aiResponse = await getAIResponse(history);

      // Save AI response
      await saveMessage(conversation.id, chatId, messageId, "assistant", aiResponse);

      // Send response to user
      await sendTelegramMessage(chatId, aiResponse);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal error", { status: 500 });
  }
});
