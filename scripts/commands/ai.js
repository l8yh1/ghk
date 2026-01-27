const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "3.0.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with Minus AI (Railway Optimized)",
  prefix: false,
  category: "ai",
  usages: "ai [message]",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) return api.sendMessage("كيراك ا صاحبي ماينوس معك🦔، قولي واش راك حاب تسقسي؟", threadID, messageID);

  try {
    // نستخدم هنا رابط API سريع جداً ولا يحتاج مفاتيح ومفتوح لسيرفرات Railway
    const res = await axios.get(`https://api.sandipbaruwal.com/gemini?prompt=${encodeURIComponent(query)}`);
    
    // تأكدنا من جلب النص الصحيح من السيرفر
    let botReply = res.data.answer || res.data.reply || res.data.response;

    if (!botReply) throw new Error("Empty response");

    // إضافة لمسة "ماينوس" الخاصة بالشباب
    const emojis = ["🦔", "🔥", "✨", "🤖", "💨"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    return api.sendMessage(`${botReply} ${randomEmoji}`, threadID, messageID);

  } catch (e) {
    // محاولة أخيرة برابط احتياطي مختلف تماماً
    try {
      const backupRes = await axios.get(`https://smty-api.vercel.app/api/gpt4?query=${encodeURIComponent(query)}`);
      return api.sendMessage(backupRes.data.result + " ⚡", threadID, messageID);
    } catch (err) {
      console.error(e);
      return api.sendMessage("❌ يا صاحبي السيرفرات اليوم راهي دايرة حالة، عاود جرب بعد دقيقة برك!", threadID, messageID);
    }
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, messageReply } = event;
  if (!messageReply || messageReply.senderID != api.getCurrentUserID() || !body) return;
  
  // تشغيل الأمر عند الرد
  module.exports.run({ api, event, args: body.split(" ") });
};
