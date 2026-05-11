require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const app = express();
const PORT = 3000;

// === ВСТАВЬ СВОЮ NGROK ССЫЛКУ СЮДА ===
const WEB_APP_URL = "https://satchel-flattered-mutation.ngrok-free.dev";

app.use(express.static(path.join(__dirname, 'mini-app')));
app.use('/stories', express.static(path.join(__dirname, 'stories')));

console.log(`🌐 Mini App URL: ${WEB_APP_URL}`);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId, "🎮 Добро пожаловать в интерактивные истории!", {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: "▶️ Запустить игру",
                    web_app: { url: WEB_APP_URL }
                }
            ]]
        }
    });
});