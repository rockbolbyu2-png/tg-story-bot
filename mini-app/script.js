const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let currentScene = "start";
let storyId = "example-story";

async function loadScene(sceneId) {
    try {
        const res = await fetch(`/stories/${storyId}.json`);
        if (!res.ok) throw new Error("Файл не найден");

        const storyData = await res.json();
        const scene = storyData.scenes[sceneId];

        if (!scene) throw new Error("Сцена не найдена");

        // Обновляем интерфейс
        document.getElementById('story-title').textContent = storyData.title || "Тёмный Лес";
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
                    // Можно добавить кнопку "Начать заново"
                    const restartBtn = document.createElement('button');
                    restartBtn.textContent = "🔄 Начать заново";
                    restartBtn.onclick = () => loadScene("start");
                    choicesDiv.appendChild(restartBtn);
                }
            };
            choicesDiv.appendChild(btn);
        });

    } catch (error) {
        console.error(error);
        document.getElementById('scene-text').innerHTML = `
            <b>Ошибка:</b><br>
            Не удалось загрузить сцену.<br><br>
            <small>${error.message}</small>
        `;
    }
}

// Запуск
window.onload = () => {
    loadScene(currentScene);
};