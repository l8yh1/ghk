const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports.config = {
  name: "ai",
  version: "1.2.0",
  permission: 0,
  credits: "IMRAN",
  description: "Chat with Gemini AI (with Chat History)",
  prefix: true,
  category: "ai",
  usages: "ai [your message]",
  cooldowns: 5
};

// Use your key here
const API_KEY = "AIzaSyCBCetzRC6TnLdYvf2hhsHCpbejJ1rjJ-Y";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// This stores the conversation history for each person/group
const chatSessions = new Map();

const cuteReplies = [
  "ماينوس معاك اصاحبي 🦔",
  "كيراك خويا؟ انا ماينوس",
  "اهلا ماينوس معك يعاونك ا صاحبي",
  "ارررررر شوفني حي"
];

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  if (!query) {
    const reply = cuteReplies[Math.floor(Math.random() * cuteReplies.length)];
    return api.sendMessage(reply, threadID, messageID);
  }

  try {
    let chat = chatSessions.get(threadID);
    if (!chat) {
      chat = model.startChat({ history: [] });
      chatSessions.set(threadID, chat);
    }

    const result = await chat.sendMessage(query);
    const response = await result.response;
    const botReply = response.text();

    api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("Gemini Error:", e);
    api.sendMessage("❌ AI is unavailable.", threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, messageReply } = event;

  // Only trigger if the user is replying to the BOT's message
  if (!messageReply || messageReply.senderID != api.getCurrentUserID()) return;
  if (!body) return;

  try {
    let chat = chatSessions.get(threadID);
    if (!chat) {
      chat = model.startChat({ history: [] });
      chatSessions.set(threadID, chat);
    }

    const result = await chat.sendMessage(body);
    const response = await result.response;
    const botReply = response.text();

    api.sendMessage(botReply, threadID, messageID);
  } catch (e) {
    console.error("AI Reply Error:", e);
  }
};
