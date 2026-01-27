const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.9.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with Minus AI (Direct Axios)",
  prefix: false,
  category: "ai",
  usages: "ai [message]",
  cooldowns: 5
};

// مفتاح Gemini الخاص بك
const API_KEY = "AIzaSyCBCetzRC6TnLdYvf2hhsHCpbejJ1rjJ-Y"; 
const MODEL = "gemini-1.5-flash"; // موديل فلاش السريع والمجاني
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// لتخزين سجل المحادثة لكل مجموعة
const chatHistory = new Map();

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) return api.sendMessage("كيراك ا صاحبي ماينوس معك🦔", threadID, messageID);

  try {
    // إعداد الذاكرة
    if (!chatHistory.has(threadID)) {
      chatHistory.set(threadID, []);
    }
    const history = chatHistory.get(threadID);

    // بناء محتوى الطلب حسب تنسيق جوجل الرسمي
    const payload = {
      contents: [
        // تعليمات النظام (System Instructions) نضعها كأول رسالة دائماً
        { role: "user", parts: [{ text: "انت روبوت مدعو بـ ماينوس مطورك الوحيد هو ياسين وانت موجود لتدردش معه هو واصدقائه سايم و ساي و جمال و موزان والكثير من الاخرين." }] },
        { role: "model", parts: [{ text: "مفهوم! انا ماينوس، جاهز للدردشة مع ياسين والشباب." }] },
        ...history,
        { role: "user", parts: [{ text: query }] }
      ]
    };

    const res = await axios.post(API_URL, payload);
    
    // استخراج الرد من JSON جوجل
    const botReply = res.data.candidates[0].content.parts[0].text;

    // حفظ في الذاكرة
    history.push({ role: "user", parts: [{ text: query }] });
    history.push({ role: "model", parts: [{ text: botReply }] });

    // تنظيف الذاكرة (آخر 10 رسائل فقط)
    if (history.length > 10) history.splice(0, 2);

    return api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("Gemini Error:", e.response?.data || e.message);
    return api.sendMessage("❌ السيرفر مشغول شوية، عاود جرب دقيقة.", threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, messageReply } = event;

  if (!messageReply || messageReply.senderID != api.getCurrentUserID() || !body) return;

  try {
    const history = chatHistory.get(threadID) || [];
    
    const payload = {
      contents: [
        { role: "user", parts: [{ text: "انت روبوت مدعو بـ ماينوس..." }] },
        { role: "model", parts: [{ text: "مفهوم!" }] },
        ...history,
        { role: "user", parts: [{ text: body }] }
      ]
    };

    const res = await axios.post(API_URL, payload);
    const botReply = res.data.candidates[0].content.parts[0].text;

    history.push({ role: "user", parts: [{ text: body }] });
    history.push({ role: "model", parts: [{ text: botReply }] });

    return api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("Reply Error:", e.message);
  }
};
