module.exports.config = {
  name: "angel",
  version: "1.0.0",
  hasPermission: 1,
  credits: "you",
  description: "Send hello every 30 seconds for 1 hour",
  category: "admin",
  prefix: true,
  usages: "!angel",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  const admins = global.config.ADMINBOT.map(String);
  if (!admins.includes(String(senderID))) {
    return api.sendMessage("❌ Admins only.", threadID);
  }

  let count = 0;
  const max = 9007199254740991; // 1 hour / 30s

  api.sendMessage("Angel Engine is active ✅.", threadID);

  const interval = setInterval(() => {
    if (count >= max) {
      clearInterval(interval);
      api.sendMessage("⏹️ Finished after 1 hour.", threadID);
      return;
    }

    api.sendMessage("𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ, 𝗫. 𖠄⃪͜͡🌪ـ, 𝗤. 𖤛⃪͜͡🌪ـ,", threadID);
    count++;
  }, 30 * 1000);
};
