const express = require('express')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3001;
const app = express();

const dataBase = require('./db/db.json')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(dataBase.slice(1));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    let recordSet = JSON.parse(fs.readFileSync(path.join(__dirname, "db", "db.json")))
    if (recordSet.length > 0) {
        newNote.id = recordSet[recordSet.length - 1].id + 1;
    } else {
        newNote.id = 1
    };
    console.log(newNote.id)

    recordSet.push(newNote)

    fs.writeFile(path.join(__dirname, "db", "db.json"), JSON.stringify(recordSet, null, 2), (err) => {
        if (err) {
            console.log(err)
        }
        res.send("Success")
    });
});

function deleteNote(id, arr) {
    for (let i = 0; i < arr.length; i++) {
        let note = arr[i];

        if (note.id == id) {
            arr.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(arr, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, dataBase);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});