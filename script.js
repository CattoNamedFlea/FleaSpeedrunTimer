let player;
let startTime = 0;
let endTime = 0;
let fps = 30; // Default, auto-detect later

function loadVideo() {
    let url = document.getElementById('video-url').value;
    let videoId = extractVideoID(url);

    if (videoId) {
        document.getElementById('video-player').innerHTML = `
            <iframe id="ytplayer" width="560" height="315" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" frameborder="0" allowfullscreen></iframe>`;
        loadYouTubeAPI();
    } else {
        alert("Invalid YouTube URL!");
    }
}

function extractVideoID(url) {
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

function loadYouTubeAPI() {
    let scriptTag = document.createElement('script');
    scriptTag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(scriptTag);
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('ytplayer', {
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    detectFPS();
}

function detectFPS() {
    if (player && player.getVideoData) {
        let qualities = player.getAvailableQualityLevels();
        if (qualities.includes("hd1080") || qualities.includes("hd720")) fps = 60;
        else fps = 30;

        document.getElementById('fps-input').value = fps;
        console.log("Detected FPS:", fps);
    }
}

function setCustomFPS() {
    const customFPS = parseInt(document.getElementById('fps-input').value, 10);
    if (!isNaN(customFPS) && customFPS > 0) {
        fps = customFPS;
        console.log("Custom FPS set to:", fps);

        const modMessageBox = document.getElementById('mod-message');
        if (modMessageBox.value) {
            checkFinalTime();
        }
    } else {
        alert("Please enter a valid FPS value.");
    }
}

function showFPSNotification() {
    const notification = document.createElement('div');
    notification.textContent = "FPS is next to '@' in Stats for Nerds.";
    notification.style.position = "absolute";
    notification.style.top = "50%";
    notification.style.left = "50%";
    notification.style.transform = "translate(-50%, -50%)";
    notification.style.backgroundColor = "#5865f2";
    notification.style.color = "#ffffff";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "6px";
    notification.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    notification.style.fontSize = "14px";
    notification.style.zIndex = "1000";
    notification.style.transition = "opacity 0.5s ease";
    notification.style.opacity = "1";

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

function moveFrames(frames) {
    if (player) {
        let currentTime = player.getCurrentTime();
        player.seekTo(currentTime + frames / fps, true);
    }
}

function setStartTime() {
    const button = document.querySelector('button[onclick="setStartTime()"]');
    if (player) {
        const currentTime = player.getCurrentTime();
        if (endTime > 0 && currentTime >= endTime) {
            console.log("Start time cannot be greater than or equal to the end time.");
            button.classList.add("shake");
            setTimeout(() => button.classList.remove("shake"), 500);
            return;
        }
        startTime = currentTime;
        document.getElementById('final-start-time').textContent = formatTime(startTime);
        checkFinalTime();
    }
}

function setEndTime() {
    const button = document.querySelector('button[onclick="setEndTime()"]');
    if (player) {
        const currentTime = player.getCurrentTime();
        if (startTime > 0 && currentTime <= startTime) {
            console.log("End time cannot be less than or equal to the start time.");
            button.classList.add("shake");
            setTimeout(() => button.classList.remove("shake"), 500);
            return;
        }
        endTime = currentTime;
        document.getElementById('final-end-time').textContent = formatTime(endTime);
        checkFinalTime();
    }
}

function typeText(text, elementId, duration) {
    const element = document.getElementById(elementId);
    element.value = "";
    let index = 0;
    const interval = duration / text.length;

    const typingInterval = setInterval(() => {
        if (index < text.length) {
            const char = text[index];
            element.value += char;
            index++;
        } else {
            clearInterval(typingInterval);
        }
    }, interval);
}

function checkFinalTime() {
    if (startTime > 0 && endTime > 0 && endTime > startTime) {
        let finalTime = (endTime - startTime).toFixed(3);
        
        document.getElementById('final-start-time').textContent = formatTime(startTime);
        document.getElementById('final-end-time').textContent = formatTime(endTime);
        document.getElementById('final-time').textContent = formatTime(finalTime);

        let modMessage = `Mod Message: Start at ${formatTime(startTime)} and end at ${formatTime(endTime)}. Framerate is ${fps} FPS. Final time - ${formatTime(finalTime)}. Retimed with [Flea's Speedrun Timer](https://github.com/CattoNamedFlea)`;

        typeText(modMessage, "mod-message", 500);

        document.getElementById('final-time-container').classList.remove("hidden");
    }
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = (time % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, '0')}`;
}

function copyModMessage() {
    let messageBox = document.getElementById('mod-message');
    messageBox.select();
    document.execCommand("copy");

    const copyButton = document.querySelector('button[onclick="copyModMessage()"]');
    copyButton.disabled = true;

    const floatingMessage = document.createElement('div');
    floatingMessage.textContent = "Copied!";
    floatingMessage.style.position = "absolute";
    floatingMessage.style.top = `${copyButton.offsetTop - 30}px`;
    floatingMessage.style.left = `${copyButton.offsetLeft + copyButton.offsetWidth / 2 - 30}px`;
    floatingMessage.style.backgroundColor = "#5865f2";
    floatingMessage.style.color = "#ffffff";
    floatingMessage.style.padding = "5px 10px";
    floatingMessage.style.borderRadius = "6px";
    floatingMessage.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    floatingMessage.style.fontSize = "14px";
    floatingMessage.style.zIndex = "1000";
    floatingMessage.style.transition = "opacity 0.5s ease";
    floatingMessage.style.opacity = "1";

    document.body.appendChild(floatingMessage);

    setTimeout(() => {
        floatingMessage.style.opacity = "0";
        setTimeout(() => floatingMessage.remove(), 500);
    }, 1000);

    setTimeout(() => {
        copyButton.disabled = false;
    }, 1100);
}

function toggleDarkMode() {
    const root = document.documentElement;
    const toggleButton = document.getElementById('dark-mode-toggle');
    toggleButton.disabled = true;

    const isDarkMode = root.style.getPropertyValue('--bg-color') === '#ffffff';

    if (isDarkMode) {
        root.style.setProperty('--bg-color', '#2c2f33');
        root.style.setProperty('--header-footer-color', '#23272a');
        root.style.setProperty('--card-color', '#36393f');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--button-color', '#5865f2');
        root.style.setProperty('--button-hover', '#4752c4');

        document.getElementById('video-url').style.backgroundColor = '#202225';
        document.getElementById('video-url').style.color = '#ffffff';
        document.getElementById('fps-input').style.backgroundColor = '#202225';
        document.getElementById('fps-input').style.color = '#ffffff';
        document.getElementById('video-player').style.backgroundColor = 'black';
        document.getElementById('mod-message').style.backgroundColor = '#202225';
        document.getElementById('mod-message').style.color = '#ffffff';
        document.getElementById('github-logo').src = 'img/github-mark-white.png';
    } else {
        root.style.setProperty('--bg-color', '#ffffff');
        root.style.setProperty('--header-footer-color', '#f1f1f1');
        root.style.setProperty('--card-color', '#e0e0e0');
        root.style.setProperty('--text-color', '#000000');
        root.style.setProperty('--button-color', '#007bff');
        root.style.setProperty('--button-hover', '#0056b3');

        document.getElementById('video-url').style.backgroundColor = '#ffffff';
        document.getElementById('video-url').style.color = '#000000';
        document.getElementById('fps-input').style.backgroundColor = '#ffffff';
        document.getElementById('fps-input').style.color = '#000000';
        document.getElementById('video-player').style.backgroundColor = '#f1f1f1';
        document.getElementById('mod-message').style.backgroundColor = '#ffffff';
        document.getElementById('mod-message').style.color = '#000000';
        document.getElementById('github-logo').src = 'img/github-mark.png';
    }

    setTimeout(() => {
        toggleButton.disabled = false;
    }, 750);
}

function typeTitle(text, elementId, duration) {
    const element = document.getElementById(elementId);
    let index = 0;
    const interval = duration / text.length;

    const typingInterval = setInterval(() => {
        if (index < text.length) {
            const span = document.createElement("span");
            span.textContent = text[index] === " " ? "\u00A0" : text[index];
            span.classList.add("typing-effect");
            element.appendChild(span);
            index++;
        } else {
            clearInterval(typingInterval);
        }
    }, interval);
}

function resetTime() {
    startTime = 0;
    endTime = 0;
    document.getElementById('final-start-time').textContent = "--:--:--.---";
    document.getElementById('final-end-time').textContent = "--:--:--.---";
    document.getElementById('final-time').textContent = "--:--:--.---";
    document.getElementById('mod-message').value = "";
    document.getElementById('final-time-container').classList.add("hidden");
}

window.onload = () => {
    typeTitle("Flea's Speedrun Timer", "header-title", 1000);
};
