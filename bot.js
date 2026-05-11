require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

const token = process.env.BOT_TOKEN;
const WEB_APP_URL = "https://tg-story-bot-je6c.onrender.com"; // ← твоя ссылка

const bot = new TelegramBot(token);
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'mini-app')));
app.use('/stories', express.static(path.join(__dirname, 'stories')));

// Webhook
const webhookUrl = `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'tg-story-bot-je6c.onrender.com'}/webhook`;

bot.setWebHook(webhookUrl).then(() => {
    console.log(`✅ Webhook установлен: ${webhookUrl}`);
}).catch(err => console.error("Webhook error:", err));

app.use(express.json());

app.post('/webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
`👋 Привет!

Добро пожаловать в **Интерактивные Истории**!

Выбери историю:`, {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🌲 Тёмный Лес", web_app: { url: `${WEB_APP_URL}?story=example-story` }}],
                [{ text: "⚙ В разработке...", callback_data: "coming_soon" }]
            ]
        }
    });
});

bot.on('callback_query', (query) => {
    if (query.data === "coming_soon") {
        bot.answerCallbackQuery(query.id, { text: "Скоро будет доступно!", show_alert: true });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Бот запущен на порту ${PORT}`);
    console.log(`🌐 Mini App: ${WEB_APP_URL}`);
});