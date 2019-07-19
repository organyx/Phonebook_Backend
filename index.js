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

app.post('/api/people/', (req, res) => {
  const body = req.body;
  //   console.log('Body', body);
  if (!body) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  if (body.name === '' || undefined || (body.phoneNumber === '' || undefined)) {
    return res.status(400).json({ error: 'some information is missing' });
  }

  const personExists = people.findIndex(person => person.name === body.name);

  if (personExists > 0) {
    return res.status(400).json({ error: 'name already exists' });
  }

  const person = {
    id: getNewId(),
    name: body.name,
    phoneNumber: body.phoneNumber
  };

  people = people.concat(person);
  res.json(person);
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

app.delete('/api/people/:id', (req, res) => {
  let id = Number(req.params.id);
  people = people.filter(person => person.id !== id);

  res.status(204).end();
});

const getNewId = () => {
  const maxId = people.length > 0 ? Math.max(...people.map(p => p.id)) : 0;

  return maxId + 1;
};

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
