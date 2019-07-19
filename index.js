const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let people = [
  {
    id: 1,
    name: 'Arto Hellas',
    phoneNumber: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    phoneNumber: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    phoneNumber: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    phoneNumber: '39-23-6423122'
  }
];

app.get('/api/people', (req, res) => {
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

app.get('/api/people/:id', (req, res) => {
  let id = Number(req.params.id);
  //   console.log(id);
  let person = people.find(p => {
    // console.log(p.id, typeof p.id, id, typeof id, p.id === id);
    return p.id === id;
  });
  console.log(person);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});