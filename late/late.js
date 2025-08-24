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

// optional: live metadata from icecast/shoutcast
async function updateMetadata() {
    try {
        const res = await fetch('http://YOUR_SERVER:PORT/status-json.xsl');
        const data = await res.json();
        const source = Array.isArray(data.icestats.source) ? data.icestats.source[0] : data.icestats.source;
        nowPlaying.textContent = source.title || 'Title – Artist';
    } catch(e) {
        nowPlaying.textContent = 'Title – Artist';
        console.error(e);
    }
}
updateMetadata();
setInterval(updateMetadata, 10000);
