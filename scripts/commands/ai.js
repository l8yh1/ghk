const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.1.0",
  permission: 0,
  credits: "IMRAN / Gemini",
  description: "Chat with Google Gemini AI",
  prefix: true,
  category: "chatgpt",
  usages: "ai [your message]",
  cooldowns: 5
};

const API_KEY = "AIzaSyCBCetzRC6TnLdYvf2hhsHCpbejJ1rjJ-Y";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const cuteReplies = [
  "ماينوس معاك اصاحبي 🦔",
  "كيراك خويا؟ انا ماينوس",
  "اهلا ماينوس معك يعاونك ا صاحبي",
  "ارررررر شوفني حي"
];

const replyMap = new Map();

async function getGeminiResponse(prompt) {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  const res = await axios.post(GEMINI_URL, payload);
  return res.data.candidates[0].content.parts[0].text;
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  if (!query) {
    const reply = cuteReplies[Math.floor(Math.random() * cuteReplies.length)];
    return api.sendMessage(reply, threadID, messageID);
  }

  try {
    const botReply = await getGeminiResponse(query);
    api.sendMessage(botReply, threadID, (err, info) => {
      if (!err) {
        if (!replyMap.has(threadID)) replyMap.set(threadID, []);
        replyMap.get(threadID).push({ messageID: info.messageID, author: senderID });
      }
    }, messageID);
  } catch (e) {
    console.error("Gemini API Error:", e.response ? e.response.data : e.message);
    api.sendMessage("❌ AI service is currently unavailable.", threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  if (!messageReply || !replyMap.has(threadID)) return;

  const replies = replyMap.get(threadID);
  const isBotReply = replies.find(item => item.messageID === messageReply.messageID);

  if (!isBotReply) return;

  try {
    const botReply = await getGeminiResponse(body);
    api.sendMessage(botReply, threadID, (err, info) => {
      if (!err) replies.push({ messageID: info.messageID, author: senderID });
    }, messageID);
  } catch (e) {
    api.sendMessage("❌ Error connecting to AI.", threadID, messageID);
  }
};
