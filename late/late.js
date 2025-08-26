const audio = document.getElementById('player');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const nowPlaying = document.getElementById('nowPlaying');

function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

playBtn.onclick = () => audio.play();
pauseBtn.onclick = () => audio.pause();
stopBtn.onclick = () => { audio.pause(); audio.currentTime = 0; };

audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    if (audio.duration) {
        progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    }
});

function connectMetadataWS() {
    const ws = new WebSocket("wss://monolith.letslovela.in/api/live/nowplaying/latestation");

    ws.onopen = () => console.log("Connected to metadata WS");
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            const np = data.now_playing?.song;
            if (np) {
                nowPlaying.textContent = `${np.artist} – ${np.title}`;
            }
        } catch (e) {
            console.error("Bad WS data", e);
        }
    };
    ws.onclose = () => {
        console.log("WS closed, retrying...");
        setTimeout(connectMetadataWS, 5000);
    };
}
connectMetadataWS();
