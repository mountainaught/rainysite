// radio script for the /late/station. might add upload and some other stuff in the future.
// better yet separate from main site into a docker container on late.lets
document.addEventListener("DOMContentLoaded", () => {
    const nowPlaying = document.getElementById("nowPlaying");
    const progressBar = document.getElementById("progressBar");
    const currentTime = document.getElementById("currentTime");
    const duration = document.getElementById("duration");

    const player = document.getElementById("player");
    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const stopBtn = document.getElementById("stopBtn");

    // actual connection to backend on azura
    const ws = new WebSocket("wss://monolith.letslovela.in/api/live/nowplaying/websocket");

    let trackElapsed = 0;
    let trackDuration = 0;
    let progressTimer;

    // handle websocket connection
    ws.onopen = () => {
        console.log("Connected to AzuraCast WebSocket");
        ws.send(JSON.stringify({
            subs: { "station:latestation": { recover: true } }
        }));
    };

    // handle player status messages
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            let np

            if ("pub" in data) { // for all subsequent updates
                np = data.pub?.data?.np?.now_playing;
            } else if ("connect" in data) {
                if (data.connect.subs) { // for initial update
                    np = data.connect.subs["station:latestation"].publications[0].data.np.now_playing;
                }
            }

            handleNowPlaying(np)
        } catch (e) {
            console.error("WebSocket message error:", e);
        }
    };

    // might remove these two i dunno what their purpose is
    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
        console.log("WebSocket closed, reconnecting in 5s...");
        setTimeout(() => window.location.reload(), 5000);
    };

    // player controls and status updates
    playBtn.addEventListener("click", () => player.play());
    pauseBtn.addEventListener("click", () => player.pause());
    stopBtn.addEventListener("click", () => {
        player.pause();
        player.currentTime = 0;
    });

    function handleNowPlaying(np) {
        if (np) {
            const title = np.song?.title || "Unknown Title"; // title
            const artist = np.song?.artist || "Unknown Artist"; // artist
            nowPlaying.textContent = `${title} – ${artist}`;

            trackElapsed = np.elapsed || 0; // elapsed time
            trackDuration = np.duration || 0; // track duration

            duration.textContent = formatTime(trackDuration);

            if (progressTimer) clearInterval(progressTimer);

            // repeating snippet to update the bar and time counter every second
            progressTimer = setInterval(() => {
                if (trackElapsed <= trackDuration) {
                    currentTime.textContent = formatTime(trackElapsed);
                    const progress = (trackElapsed / trackDuration) * 100;
                    progressBar.style.width = progress + "%";
                    trackElapsed++;
                }
            }, 1000);
        }
    }

    function formatTime(sec) {
        if (isNaN(sec)) return "0:00";
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
});
