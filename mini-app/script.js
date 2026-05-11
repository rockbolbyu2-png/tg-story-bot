// Универсальная версия для тестирования и Telegram
let tg;
if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
} else {
    console.log("⚠️ Запущено в обычном браузере (тестовый режим)");
    tg = {
        showAlert: (msg) => alert(msg),
        ready: () => {},
        expand: () => {}
    };
}

let currentScene = "start";
let storyId = "example-story";

async function loadScene(sceneId) {
    try {
        const res = await fetch(`/stories/${storyId}.json`);
        
        if (!res.ok) throw new Error("Файл истории не найден");

        const storyData = await res.json();
        const scene = storyData.scenes[sceneId];

        document.getElementById('story-title').textContent = storyData.title || "История";
        document.getElementById('scene-image').src = scene.image;
        document.getElementById('scene-text').innerHTML = scene.text;

        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';

        scene.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.textContent = choice.text;
            btn.onclick = () => {
                if (choice.next) {
                    currentScene = choice.next;
                    loadScene(choice.next);
                } else if (choice.end) {
                    tg.showAlert(choice.end);
                }
            };
            choicesDiv.appendChild(btn);
        });

    } catch (error) {
        console.error(error);
        document.getElementById('scene-text').innerHTML = `
            <b>Ошибка:</b><br>
            Не удалось загрузить историю<br><br>
            <small>${error.message}</small>
        `;
    }
}

// Запуск
window.onload = () => {
    loadScene(currentScene);
};