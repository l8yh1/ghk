const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.8.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with Minus AI (Optimized)",
  prefix: false,
  category: "ai",
  usages: "ai [message]",
  cooldowns: 5
};

const API_KEY = "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";
// جرب هذا الموديل فهو أسرع وأقل أخطاءً من DeepSeek R1 المجاني حالياً
const MODEL_NAME = "google/gemini-2.0-flash-exp:free"; 

const chatHistory = new Map();

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

    const botReply = res.data.choices[0].message.content;
    history.push({ role: "assistant", content: botReply });

    if (history.length > 10) history.splice(1, 2);

    return api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("OpenRouter Error:", e.response?.data || e.message);
    // إذا ظهر خطأ 429 يعني انتهت الـ 50 رسالة لليوم
    if (e.response?.status === 429) {
      return api.sendMessage("❌ خلصت حصتي لليوم (50 رسالة). جرب غداً أو استعمل مفتاحاً آخر!", threadID, messageID);
    }
    return api.sendMessage("❌ السيرفر مضغوط حالياً، جرب ترسل الرسالة مرة ثانية.", threadID, messageID);
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
      headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" }
    });

    const botReply = res.data.choices[0].message.content;
    history.push({ role: "assistant", content: botReply });
    return api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("Reply Error:", e.message);
  }
};
