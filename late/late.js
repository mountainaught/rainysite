// Grab elements
const audio = document.getElementById("player");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const nowPlayingEl = document.getElementById("nowPlaying");

// --- Audio Player Controls ---
playBtn.addEventListener("click", () => {
    audio.play();
});

pauseBtn.addEventListener("click", () => {
    audio.pause();
});

stopBtn.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    progressBar.style.width = "0%";
    currentTimeEl.textContent = "0:00";
});

// Update progress bar + timer
audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});

function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

// --- AzuraCast WebSocket for Now Playing ---
let socket = new WebSocket("wss://monolith.letslovela.in/api/live/nowplaying/websocket");

socket.onopen = () => {
    socket.send(JSON.stringify({
        "subs": {
            "station:latestation": {"recover": true}
        }
    }));
};

socket.onmessage = (e) => {
    const jsonData = JSON.parse(e.data);

    if ('pub' in jsonData) {
        handleNowPlaying(jsonData.pub);
    } else if ('connect' in jsonData) {
        const connectData = jsonData.connect;
        if ('subs' in connectData) {
            for (const subName in connectData.subs) {
                const sub = connectData.subs[subName];
                if ('publications' in sub) {
                    sub.publications.forEach((row) => handleNowPlaying(row, false));
                }
            }
        }
    }
};

function handleNowPlaying(payload) {
    if (payload.data && payload.data.np) {
        const track = payload.data.np.now_playing.song;
        nowPlayingEl.textContent = `${track.title} – ${track.artist}`;
    }
}
