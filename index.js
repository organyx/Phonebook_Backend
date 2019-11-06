const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())


morgan.token(
  'postBody',
  (getPostBody = req => {
    return req.postBody
  })
)

function assignPostBody(req, res, next) {
  //   console.log(req.method === 'POST');
  if (req.method === 'POST') {
    req.postBody = JSON.stringify(req.body)
  }
  next()
}

app.use(assignPostBody)
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postBody'
  )
)

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
]

app.get('/api/people', (req, res) => {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.phoneNumber}`)
    })
    res.json(result)
  })
})

app.get('/api/info', (req, res) => {
  Person.find({}).then(result => {
    res.send(`
        <div>
        Phonebook contains ${result.length} people
        <br />
        ${new Date()}
        </div>
    `)
  })

})

app.post('/api/people/', (req, res, next) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  if (body.name === '' || undefined || (body.phoneNumber === '' || undefined)) {
    return res.status(400).json({ error: 'some information is missing' })
  }

  const person = new Person({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber
  })

  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedFormatedPerson => {
      res.json(savedFormatedPerson)
    })
    .catch(err => {
      console.log('err', err)
      next(err)
    })
})

app.get('/api/people/:id', (req, res, next) => {
  let id = req.params.id
  Person.findById(id).then(person => {
    if (person) {
      res.json(person.toJSON())
    }
    else {
      res.status(404).end()
    }
  }).catch(err => {
    next(err)
  })

})

app.delete('/api/people/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/people/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    phoneNumber: body.phoneNumber
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    }).catch(err => next(err))
})

// const getNewId = () => {
//   const maxId = people.length > 0 ? Math.max(...people.map(p => p.id)) : 0

//   return maxId + 1
// }

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
