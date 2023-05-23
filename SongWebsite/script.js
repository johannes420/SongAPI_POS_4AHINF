const { json } = require("express/lib/response");

var selectedRow = null;

function onFormSubmit() {
    if (validate()) {
        var formData = readFormData();
        if (selectedRow == null){
            insertNewRecord(formData);
            sendDataToAPI(formData);
            resetForm();
        }
        else{
            updateRecord(formData);
            resetForm();
            loadData();
    }
    }
}

function sendDataToAPI(formData) {
    fetch('http://localhost:3020/addSong', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Daten erfolgreich an die API gesendet:', data);
        loadData();
    })
    .catch(error => {
        console.log('Fehler beim Senden der Daten an die API:', error);
    });
}




function readFormData() {
    var formData = {};
    formData.titel = document.getElementById("titel").value;
    formData.artist = document.getElementById("artist").value;
    formData.genre = document.getElementById("genre").value;
    formData.album = document.getElementById("hasAlbum").checked ? document.getElementById("album").value : "n/a";
    return formData;
}

function insertNewRecord(data) {
    var table = document.getElementById("songList").getElementsByTagName("tbody")[0];
    var newRow = table.insertRow(table.length);


    var cell1 = newRow.insertCell(0);
    cell1.style.display = "none";
    cell1.innerHTML = data.id;

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.titel;
    

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.artist;
    

    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.genre;
    

    var cell5 = newRow.insertCell(4);
    cell5.innerHTML = data.album;

    var cell6 = newRow.insertCell(5);
    cell6.innerHTML = `<button onClick="onEdit(this)">Edit</button> 
    <button onClick="onDelete()">Delete</button>`;
}



function resetForm() {
    document.getElementById("titel").value = "";
    document.getElementById("artist").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("hasAlbum").checked = false;
    document.getElementById("album").value = "";
    document.getElementById("album").disabled = true;
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("titel").value = selectedRow.cells[1].innerHTML;
    document.getElementById("artist").value = selectedRow.cells[2].innerHTML;
    document.getElementById("genre").value = selectedRow.cells[3].innerHTML;
    var albumCell = selectedRow.cells[4];
    if (albumCell.innerHTML === "n/a") {
        document.getElementById("hasAlbum").checked = false;
        document.getElementById("album").value = "";
        document.getElementById("album").disabled = true;
    } else {
        document.getElementById("hasAlbum").checked = true;
        document.getElementById("album").value = albumCell.innerHTML;
        document.getElementById("album").disabled = false;
    }
}

function updateRecord(formData) {
    var id = selectedRow.cells[0].innerHTML; 
    formData = { id, ...formData }; 

    fetch(`http://localhost:3020/updateSong/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Daten erfolgreich an die API gesendet:', data);
    })
    .catch(error => {
        console.log('Fehler beim Senden der Daten an die API:', error);
    });
}


function onDelete() {
    if (confirm("Are you sure to delete this record?")) {
        var button = event.target;
        var row = button.parentNode.parentNode;
        var id = row.cells[0].innerHTML;

        fetch(`http://localhost:3020/deleteSong/${id}`, { method: 'DELETE' })
            .then(response => response.text())
            .then(data => {
                console.log('API-Antwort:', data);
                row.remove();
            })
            .catch(error => {
                console.log('Fehler beim Löschen der Daten von der API:', error);
            });
    }
}





function validate() {
    var isValid = true;
    var titleInput = document.getElementById("titel");
    var artistInput = document.getElementById("artist");
    var genreInput = document.getElementById("genre");
    var hasAlbumCheckbox = document.getElementById("hasAlbum");
    var albumInput = document.getElementById("album");

    if (titleInput.value === "") {
        isValid = false;
        document.getElementById("titleValidationError").classList.remove("hide");
    } else {
        if (!document.getElementById("titleValidationError").classList.contains("hide")) {
            document.getElementById("titleValidationError").classList.add("hide");
        }
    }

    if (artistInput.value === "") {
        isValid = false;
        document.getElementById("artistValidationError").classList.remove("hide");
    } else {
        if (!document.getElementById("artistValidationError").classList.contains("hide")) {
            document.getElementById("artistValidationError").classList.add("hide");
        }
    }

    if (genreInput.value === "") {
        isValid = false;
        document.getElementById("genreValidationError").classList.remove("hide");
    } else {
        if (!document.getElementById("genreValidationError").classList.contains("hide")) {
            document.getElementById("genreValidationError").classList.add("hide");
        }
    }

    if (hasAlbumCheckbox.checked && albumInput.value === "") {
        isValid = false;
        document.getElementById("albumValidationError").classList.remove("hide");
    } else {
        if (!document.getElementById("albumValidationError").classList.contains("hide")) {
            document.getElementById("albumValidationError").classList.add("hide");
        }
    }

    return isValid;
}


function toggleAlbumInput() {
    var albumInput = document.getElementById("album");
    if (document.getElementById("hasAlbum").checked) {
        albumInput.disabled = false;
    } else {
        albumInput.value = "";
        albumInput.disabled = true;
    }
}

function loadData() {
    fetch('http://localhost:3020/getAllSongs')
        .then(response => response.json())
        .then(data => {
            clearTable();
            data.forEach(song => {
                var formData = {
                    id: song.id,
                    titel: song.titel,
                    artist: song.artist,
                    genre: song.genre,
                    album: song.album || "n/a"
                };
                insertNewRecord(formData);
            });
        })
        .catch(error => {
            console.log('Fehler beim Abrufen der Daten:', error);
        });
}

function clearTable() {
    var table = document.getElementById("songList").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Alle Zeilen löschen
}