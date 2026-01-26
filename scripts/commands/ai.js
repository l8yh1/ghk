constconst axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.6.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with DeepSeek R1 (Minus)",
  prefix: true,
  category: "ai",
  usages: "ai [message]",
  cooldowns: 5
};

// Your OpenRouter Key
const API_KEY = "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";
// Updated to the standard free model ID
const MODEL_NAME = "deepseek/deepseek-r1:free"; 

const chatHistory = new Map();

// Helper to clean the response from <think> tags
function cleanResponse(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) return api.sendMessage("كيراك ا صاحبي ماينوس معك🦔", threadID, messageID);

  try {
    if (!chatHistory.has(threadID)) {
      chatHistory.set(threadID, [{ role: "system", content: "انت روبوت مدعو بـ ماينوس مطورك الوحيد هو ياسين وانت موجود لتدردش معه هو واصدقائه سايم و ساي و جمال و موزان والكثير من الاخرين." }]);
    }
    const history = chatHistory.get(threadID);
    history.push({ role: "user", content: query });

    const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: MODEL_NAME,
      messages: history,
    }, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    let botReply = res.data.choices[0].message.content;
    botReply = cleanResponse(botReply); // Remove the thinking part
    
    history.push({ role: "assistant", content: botReply });
    if (history.length > 11) history.splice(1, 2);

    return api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("OpenRouter Error:", e.response?.data || e.message);
    return api.sendMessage("❌ خطأ: لم يتم العثور على المستخدم أو الخدمة مشغولة حالياً.", threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, messageReply } = event;

  if (!messageReply || messageReply.senderID != api.getCurrentUserID() || !body) return;

  try {
    const history = chatHistory.get(threadID) || [{ role: "system", content: "انت روبوت مدعو بـ ماينوس..." }];
    history.push({ role: "user", content: body });

    const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: MODEL_NAME,
      messages: history,
    }, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    let botReply = res.data.choices[0].message.content;
    botReply = cleanResponse(botReply);
    
    history.push({ role: "assistant", content: botReply });
    return api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("Reply Error:", e.message);
  }
};
 axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.5.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with DeepSeek R1 (Free)",
  prefix: true,
  category: "ai",
  usages: "ai [message]",
  cooldowns: 5
};

// Your OpenRouter Key
const API_KEY = "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";
// Your chosen Free Model
const MODEL_NAME = "deepseek/deepseek-r1-0528:free"; 

const chatHistory = new Map();

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) return api.sendMessage("كيراك ا صاحبي ماينوس معك🦔", threadID, messageID);

  try {
    // Start session history
    if (!chatHistory.has(threadID)) {
      chatHistory.set(threadID, [{ role: "system", content: "You are a helpful AI assistant." }]);
    }
    const history = chatHistory.get(threadID);
    history.push({ role: "user", content: query });

    // API Call to OpenRouter
    const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: MODEL_NAME,
      messages: history,
    }, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const botReply = res.data.choices[0].message.content;
    history.push({ role: "assistant", content: botReply });

    // Keep memory clean (last 10 messages)
    if (history.length > 11) history.splice(1, 2);

    return api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("OpenRouter Error:", e.response?.data || e.message);
    const errorMsg = e.response?.data?.error?.message || "Service is busy. Try again later!";
    return api.sendMessage(`❌ Error: ${errorMsg}`, threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, messageReply } = event;

  // Responds when you reply to the bot's message
  if (!messageReply || messageReply.senderID != api.getCurrentUserID() || !body) return;

  try {
    const history = chatHistory.get(threadID) || [{ role: "system", content: "انت روبوت مدعو بـ ماينوس مطورك الوحيد هو ياسين وانت موجود لتدردش معه هو واصدقائه سايم و ساي و جمال و موزان والكثير من الاخرين اذا رأيت شخص لا تعرف من هو يمكنك سؤال ياسين وهو سيطورك أكثر ويضع معلومات عن كل شخص سيتجده في ذلك المجتمع" }];
    history.push({ role: "user", content: body });

    const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: MODEL_NAME,
      messages: history,
    }, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const botReply = res.data.choices[0].message.content;
    history.push({ role: "assistant", content: botReply });

    return api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("Reply Error:", e.message);
  }
};
