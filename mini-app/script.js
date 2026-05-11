const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let storyId = "example-story";
let currentScene = "start";

async function loadScene(sceneId) {
    try {
        const res = await fetch(`/stories/${storyId}.json`);
        
        if (!res.ok) {
            throw new Error("Файл истории не найден");
        }

        const storyData = await res.json();
        const scene = storyData.scenes[sceneId];

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
                }
            };
            choicesDiv.appendChild(btn);
        });

    } catch (err) {
        console.error(err);
        document.getElementById('scene-text').innerHTML = `
            <b>Ошибка загрузки</b><br><br>
            Не удалось загрузить историю.<br>
            Проверьте наличие файла stories/example-story.json
        `;
    }
}

// Запуск
window.onload = () => {
    loadScene(currentScene);
};