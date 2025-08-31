const list = document.getElementById("songListInstance");

let titleString = "";
let artistString = "";

const titleInput = document.getElementById("title");
const artistInput = document.getElementById("artist");


function updateArtist(){
    artistString = artistInput.value;
    listSongs();
}

function updateTitle(){
    titleString = titleInput.value;
    listSongs();
}

const titleFilter = (toFilter) => {
    if (titleString !== ""){
        return toFilter.filter(song => song.name.toLowerCase().includes(titleString.toLowerCase()))
    }
    return toFilter;
}

const artistFilter = (toFilter) => {
    if (artistString !== ""){
        return toFilter.filter(song => song.artist.toLowerCase().includes(artistString.toLowerCase()))
    }
    return toFilter;
}

let filters = [
    titleFilter,
    artistFilter,
];

function listSongs(){
    let filteredSongs = songs;

    filters.forEach(filter => {
        filteredSongs = filter(filteredSongs);
    });

    let html = "<ol>";
    filteredSongs.forEach(song => {
        html += "<li><p>Title: <strong>"+song.name+"</strong></p><p>Artist: <strong>"+song.artist+"</strong></p></li>";
    });
    html += "</ol>";
    list.innerHTML = html;
}

listSongs();

