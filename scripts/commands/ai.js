const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "2.1.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with Minus AI (No-Key Mode)",
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

  try {
    if (!chatHistory.has(threadID)) {
      chatHistory.set(threadID, [{ role: "user", content: "اسمك هو ماينوس. مطورك هو ياسين. أصدقاؤك هم سايم، ساي، جمال، وموزان. تحدث بلهجة عربية عامية خفيفة وكن مرحاً." }]);
    }
    const history = chatHistory.get(threadID);
    history.push({ role: "user", content: query });

    // استخدام بروكساي API مجاني للوصول لـ GPT-4o-mini أو Llama
    // هذا الرابط يعمل كبديل ممتاز ولا يحتاج تسجيل دخول
    const response = await axios.post("https://api.pawan.krd/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: history
    }, {
      headers: { "Authorization": "Bearer pk-***" } // سنستخدم API عام أو رابط بديل
    }).catch(async () => {
        // إذا فشل الرابط الأول، نستخدم رابط "KAIZ" المحدث الذي يعمل بـ axios
        return await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o?ask=${encodeURIComponent(query)}`);
    });

    const botReply = response.data.choices ? response.data.choices[0].message.content : response.data.response;

    history.push({ role: "assistant", content: botReply });
    if (history.length > 10) history.splice(1, 2);

    return api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    return api.sendMessage("❌", threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, messageReply } = event;
  if (!messageReply || messageReply.senderID != api.getCurrentUserID() || !body) return;
  module.exports.run({ api, event, args: body.split(" ") });
};
