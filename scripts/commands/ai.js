const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "4.0.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with Minus AI (Anti-Block Mode)",
  prefix: false,
  category: "ai",
  usages: "ai [message]",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) return api.sendMessage("كيراك ا صاحبي ماينوس معك🦔، قولي واش عندك؟", threadID, messageID);

  try {
    // محاولة استخدام رابط API هندي/عالمي معروف باستقراره مع Railway
    const res = await axios.get(`https://deku-rest-api.gleeze.com/api/gpt-4?q=${encodeURIComponent(query)}`);
    
    let botReply = res.data.result || res.data.response || res.data.reply;

    if (!botReply) throw new Error("No data");

    return api.sendMessage(botReply, threadID, messageID);

  } catch (e) {
    try {
      // إذا فشل الأول، نستخدم هذا الرابط الذي يعمل كـ "بروكسي"
      const res2 = await axios.get(`https://api.kenliejugarap.com/blackbox/?text=${encodeURIComponent(query)}`);
      let reply2 = res2.data.response;
      
      return api.sendMessage(reply2, threadID, messageID);
    } catch (e2) {
      // المحاولة الأخيرة: رابط Gemini مختلف
      try {
         const res3 = await axios.get(`https://api.maher-zubair.tech/ai/gemini?q=${encodeURIComponent(query)}`);
         return api.sendMessage(res3.data.result, threadID, messageID);
      } catch (e3) {
         return api.sendMessage("ارقد مراحش نخدم تا حاجة", threadID, messageID);
      }
    }
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, messageReply } = event;
  if (!messageReply || messageReply.senderID != api.getCurrentUserID() || !body) return;
  module.exports.run({ api, event, args: body.split(" ") });
};
