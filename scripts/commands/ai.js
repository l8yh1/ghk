const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.7.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with DeepSeek R1 (Minus)",
  prefix: false, // Changed to false to fix the "command not found" bug
  category: "ai",
  usages: "ai [message]",
  cooldowns: 5
};

const API_KEY = "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";
const MODEL_NAME = "deepseek/deepseek-r1:free"; 

const chatHistory = new Map();

function cleanResponse(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, body } = event;
  
  // This part ensures it works with OR without the "!" prefix
  let query = args.join(" ");
  
  // If the user just typed "!ai" without text
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
    botReply = cleanResponse(botReply);
    
    history.push({ role: "assistant", content: botReply });
    if (history.length > 11) history.splice(1, 2);

    return api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("OpenRouter Error:", e.response?.data || e.message);
    return api.sendMessage("❌ خطأ: حاول مجدداً لاحقاً.", threadID, messageID);
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
