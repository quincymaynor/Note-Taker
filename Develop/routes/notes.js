const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../../fsUtils');

notes.get('/', (req, res) => {
  readFromFile('./db/db.json', 'utf8').then((data) => res.json(JSON.parse(data)));
});

notes.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text, } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  console.log('ID', noteId);
  readFromFile('./db/db.json', 'utf8')
    .then((data) => {(JSON.parse(data)); return data})

    .then((json) => {

      const result = JSON.parse(json).filter((note) => note.id !== noteId);

      writeToFile('./db/db.json', result);
    })

    .then(() => {res.sendStatus(200)})
    .catch(err => console.log(err))
});

module.exports = notes;
