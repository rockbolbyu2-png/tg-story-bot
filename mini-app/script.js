// Самая простая рабочая версия
let currentScene = "start";

async function loadScene(sceneId) {
    try {
        const res = await fetch('/stories/example-story.json');
        const story = await res.json();
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
        document.getElementById('scene-text').innerHTML = "❌ Не удалось загрузить историю.<br><br>Проверь файл example-story.json";
    }
}

window.onload = () => loadScene(currentScene);