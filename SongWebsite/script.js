// const { json } = require("express/lib/response");

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
    cell6.innerHTML = `<button style=" margin-left: -1%; margin-top: -20px; height: 20px; width: 65px;" onClick="onEdit(this)">Edit</button> 
    <button style=" margin-top: 5px; margin-left: -1%; height: 20px; width: 65px" onClick="onDelete()">Delete</button>`;

    newRow.addEventListener('click', function() {
        openItemWindow(data);
    });
}

function openItemWindow(data) {
    var clickedCellIndex = event.target.cellIndex;
    if (clickedCellIndex < 5) {
        // Create a new <div> element
        var itemWindow = document.createElement('div');
        itemWindow.classList.add('item-window');

        // Generate the HTML content for the item details
        var content =  "<p><strong>Title:</strong> " + data.titel + "</p>" +
                      "<p><strong>Artist:</strong> " + data.artist + "</p>" +
                      "<p><strong>Genre:</strong> " + data.genre + "</p>" +
                      "<p><strong>Album:</strong> " + data.album + "</p>";

        // Set the HTML content of the <div>
        itemWindow.innerHTML = content;

        // Create a close button
        var closeButton = document.createElement('button');
        closeButton.innerText = 'X';
        closeButton.style.width = "25px";
        closeButton.style.height = "25px";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.left = "282px"

        closeButton.addEventListener('click', function() {
            // Remove the item window when the close button is clicked
            itemWindow.remove();
        });

        // Append the close button to the item window
        itemWindow.appendChild(closeButton);

        // Append the <div> to the document body
        document.body.appendChild(itemWindow);
    }
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
        document.getElementById("album").style.opacity = 0.5;
    } else {
        document.getElementById("hasAlbum").checked = true;
        document.getElementById("album").value = albumCell.innerHTML;
        document.getElementById("album").disabled = false;
        document.getElementById("album").style.opacity = 1;
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
        loadData();
    })
    .catch(error => {
        console.log('Fehler beim Senden der Daten an die API:', error);
        loadData();
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
    var titleInput = document.getElementById("titel");
    var artistInput = document.getElementById("artist");
    var genreInput = document.getElementById("genre");
    var hasAlbumCheckbox = document.getElementById("hasAlbum");
    var albumInput = document.getElementById("album");
    var isValid = true;
    var errorMessage = "Fill in all fields.";
    
    if (titleInput.value === "" || artistInput.value === "" || genreInput.value === "" || (hasAlbumCheckbox.checked && albumInput.value === "")) {
        isValid = false;
        alert(errorMessage);
    }
    
    return isValid;
}


function toggleAlbumInput() {
    var albumInput = document.getElementById("album");
    if (document.getElementById("hasAlbum").checked) {
        albumInput.disabled = false;
        albumInput.style.opacity = 1;
    } else {
        albumInput.value = "";
        albumInput.disabled = true;
        albumInput.style.opacity = 0.5;
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

const themeToggle = document.getElementById('toggleTheme');
const themeStyle = document.getElementById('themeStyle');

themeToggle.addEventListener('change', function() {
  if (themeToggle.checked) {
    themeStyle.href = 'style_light.css';
  } else {
    themeStyle.href = 'style_dark.css';
  }
});