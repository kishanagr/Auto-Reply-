const login = require("ws3-fca");
const fs = require("fs");
const express = require("express");

// ✅ AppState (fbstate.json) लोड करना
let appState;
try {
  appState = JSON.parse(fs.readFileSync("appstate.json", "utf-8"));
} catch (err) {
  console.error("❌ appstate.json पढ़ने में दिक्कत:", err);
  process.exit(1);
}

// ✅ Express सर्वर (Render/UptimeRobot के लिए ज़िंदा रखने को)
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("🤖 Auto Reply Bot चालू है!"));
app.listen(PORT, () => console.log(`🌐 वेब सर्वर ${PORT} पोर्ट पर चल रहा है`));

// ✅ Auto Reply फ़ंक्शन
function startAutoReply(api) {
  api.listenMqtt((err, event) => {
    if (err) return console.error("❌ Listen Error:", err);

    if (event.type === "message" && event.body) {
      console.log(`💬 ${event.senderID} ने मैसेज भेजा: ${event.body}`);

      // ✅ Auto reply भेजना
      api.sendMessage("✅ आपका मैसेज मिल गया भाई!", event.threadID, (err) => {
        if (err) console.error("❌ Reply भेजने में दिक्कत:", err);
        else console.log("✅ Reply भेज दिया गया.");
      });
    }
  });
}

// 🟢 Login
login({ appState }, (err, api) => {
  if (err) {
    console.error("❌ Login Failed:", err);
    return;
  }

  console.log("✅ लॉगिन सफल। Auto Reply चालू है।");
  startAutoReply(api);
});
