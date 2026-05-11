require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const app = express();
const PORT = process.env.PORT || 3000;

// === ТВОЯ ССЫЛКА С RENDER (измени, если нужно) ===
const WEB_APP_URL = "https://tg-story-bot-je6c.onrender.com";

app.use(express.static(path.join(__dirname, 'mini-app')));
app.use('/stories', express.static(path.join(__dirname, 'stories')));

console.log(`🚀 Бот запущен`);
console.log(`🌐 Mini App URL: ${WEB_APP_URL}`);

// ==================== КОМАНДА /start ====================
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 
`👋 *Привет! Добро пожаловать в Интерактивные Истории!*

Здесь каждый твой выбор влияет на развитие сюжета и концовку.

Выбери историю для прохождения:`, 
    {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { 
                        text: "🌲 1. Тёмный Лес", 
                        web_app: { url: `${WEB_APP_URL}?story=example-story` } 
                    }
                ],
                [
                    { 
                        text: "⚙ 2. В разработке...", 
                        callback_data: "coming_soon" 
                    }
                ]
            ]
        }
    });
});

// Обработка кнопки "В разработке"
bot.on('callback_query', async (query) => {
    if (query.data === "coming_soon") {
        await bot.answerCallbackQuery(query.id, {
            text: "😊 Эта история пока в разработке!\n\nСкоро будет доступна.",
            show_alert: true
        });
    }
});

app.listen(PORT, () => {
    console.log(`🌍 Сервер запущен на порту ${PORT}`);
});