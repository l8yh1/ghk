const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "2.5.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with Minus AI (Multi-Source Mode)",
  prefix: false,
  category: "ai",
  usages: "ai [message]",
  cooldowns: 5
};

const chatHistory = new Map();

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) return api.sendMessage("كيراك ا صاحبي ماينوس معك🦔", threadID, messageID);

  // إعداد ذاكرة بسيطة
  if (!chatHistory.has(threadID)) {
    chatHistory.set(threadID, []);
  }
  const history = chatHistory.get(threadID);

  try {
    let botReply = "";

    // --- المصدر الأول: Kaiz API (مستقر جداً لبوتات فيسبوك) ---
    try {
      const res = await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o?ask=${encodeURIComponent(query)}`);
      botReply = res.data.response;
    } catch (err) {
      // --- المصدر الثاني: إذا فشل الأول، نجرب API بديل لـ Gemini ---
      try {
        const res = await axios.get(`https://kaiz-apis.gleeze.com/api/gemini?ask=${encodeURIComponent(query)}`);
        botReply = res.data.response;
      } catch (err2) {
        // --- المصدر الثالث: API عام مفتوح ---
        const res = await axios.get(`https://api.shayan-ai.workers.dev/chat?q=${encodeURIComponent(query)}`);
        botReply = res.data.answer || res.data.response;
      }
    }

    if (!botReply) throw new Error("No response from any source");

    // إضافة الشخصية يدوياً في البداية إذا كان الرد جافاً
    if (history.length === 0) {
      botReply = "مرحباً! أنا ماينوس صديق ياسين والشباب.. " + botReply;
    }

    // تحديث الذاكرة
    history.push({ q: query, a: botReply });
    if (history.length > 5) history.shift();

    return api.sendMessage(botReply, threadID, messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ والله يا صاحبي السيرفرات كلها تعبانة حاليا.", threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, messageReply } = event;
  if (!messageReply || messageReply.senderID != api.getCurrentUserID() || !body) return;
  
  // تشغيل الأمر عند الرد (Reply)
  module.exports.run({ api, event, args: body.split(" ") });
};





