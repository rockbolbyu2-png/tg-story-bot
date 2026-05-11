require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const app = express();
const PORT = process.env.PORT || 3000;

const WEB_APP_URL = "https://tg-story-bot-x3rc.vercel.app";   // ← Твоя ссылка с Vercel

app.use(express.static(path.join(__dirname, 'mini-app')));
app.use('/stories', express.static(path.join(__dirname, 'stories')));

console.log(`🚀 Бот запущен | Mini App: ${WEB_APP_URL}`);

// ==================== КОМАНДА /start ====================
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 
`👋 Привет! Добро пожаловать в **Интерактивные Истории**!

Здесь ты можешь пройти увлекательные сюжеты, где каждый твой выбор влияет на концовку.

Выбери историю:`, 
    {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    { 
                        text: "🌲 Тёмный Лес", 
                        web_app: { url: `${WEB_APP_URL}?story=example-story` } 
                    }
                ],
                [
                    { 
                        text: "⚙ В разработке...", 
                        callback_data: "coming_soon" 
                    }
                ]
            ]
        }
    });
});

// Обработка нажатия на кнопку "В разработке"
bot.on('callback_query', (query) => {
    if (query.data === "coming_soon") {
        bot.answerCallbackQuery(query.id, {
            text: "😊 Эта история скоро будет готова!",
            show_alert: true
        });
    }
});

app.listen(PORT, () => {
    console.log(`🌐 Сервер работает на порту ${PORT}`);
});