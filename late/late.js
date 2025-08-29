document.addEventListener("DOMContentLoaded", () => {
    const nowPlaying = document.getElementById("nowPlaying");
    const player = document.getElementById("player");
    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const stopBtn = document.getElementById("stopBtn");
    const progressBar = document.getElementById("progressBar");

    const currentTimeEl = document.getElementById("currentTime");
    const durationEl = document.getElementById("duration");

    // --- AzuraCast WebSocket Connection ---
    const ws = new WebSocket("wss://monolith.letslovela.in/api/live/nowplaying/websocket");

    ws.onopen = () => {
        console.log("Connected to AzuraCast WebSocket");
        // subscribe to the station channel
        ws.send(JSON.stringify({
            subs: { "station:latestation": {} }
        }));
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            // check channel payload
            if (data["station:latestation"] && data["station:latestation"].now_playing) {
                const np = data["station:latestation"].now_playing;
                const title = np.song?.title || "Unknown Title";
                const artist = np.song?.artist || "Unknown Artist";
                nowPlaying.textContent = `${title} – ${artist}`;
            } else {
                console.log("WS message:", data);
            }
        } catch (e) {
            console.error("WebSocket message error:", e);
        }
    };

    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
        console.log("WebSocket closed, reconnecting in 5s...");
        setTimeout(() => window.location.reload(), 5000);
    };

    // --- Audio Controls ---
    playBtn.addEventListener("click", () => player.play());
    pauseBtn.addEventListener("click", () => player.pause());
    stopBtn.addEventListener("click", () => {
        player.pause();
        player.currentTime = 0;
    });

    // --- Progress Bar & Timer ---
    player.addEventListener("timeupdate", () => {
        if (!isNaN(player.duration)) {
            const progress = (player.currentTime / player.duration) * 100;
            progressBar.style.width = progress + "%";
        }

        currentTimeEl.textContent = formatTime(player.currentTime);
        durationEl.textContent = formatTime(player.duration);
    });

    function formatTime(sec) {
        if (isNaN(sec)) return "0:00";
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
});
