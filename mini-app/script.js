const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

async function testStory() {
    try {
        const res = await fetch('/stories/example-story.json');
        const text = await res.text();
        
        document.getElementById('scene-text').innerHTML = `
            <b>Статус:</b> ${res.status}<br>
            <b>Ответ сервера:</b><br>
            <pre>${text.substring(0, 500)}...</pre>
        `;
    } catch (e) {
        document.getElementById('scene-text').innerHTML = `Ошибка: ${e.message}`;
    }
}

// Запуск теста
window.onload = testStory;