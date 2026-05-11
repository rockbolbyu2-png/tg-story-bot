// Простая версия без Telegram WebApp (для отладки)
let currentScene = "start";
let storyId = "example-story";

async function loadScene(sceneId) {
    try {
        const response = await fetch(`/stories/${storyId}.json`);
        if (!response.ok) throw new Error("Файл не найден");

        const story = await response.json();
        const scene = story.scenes[sceneId];

        document.getElementById('story-title').textContent = story.title;
        document.getElementById('scene-image').src = scene.image;
        document.getElementById('scene-text').innerHTML = scene.text;

        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';

        scene.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.textContent = choice.text;
            btn.onclick = () => {
                if (choice.next) loadScene(choice.next);
                else alert(choice.end || "Конец истории");
            };
            choicesDiv.appendChild(btn);
        });

    } catch (e) {
        document.getElementById('scene-text').innerHTML = 
            `<b>Ошибка:</b><br>Не могу загрузить историю.<br><br>Проверь файл stories/example-story.json`;
        console.error(e);
    }
}

// Запуск
loadScene(currentScene);