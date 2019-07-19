const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let people = [
  {
    name: 'Arto Hellas',
    phoneNumber: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    phoneNumber: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    phoneNumber: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    phoneNumber: '39-23-6423122',
    id: 4
  }
];

app.get('/api/persons', (req, res) => {
  res.json(people);
});

app.get('/info', (req, res) => {
  res.send(`
        <div>
        Phonebook contains ${people.length} people
        <br />
        ${new Date()}
        </div>
    `);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
