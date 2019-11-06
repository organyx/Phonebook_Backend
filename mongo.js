const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack_phonebook:${password}@cluster0-pom4l.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })
mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`)
  process.exit(-1)
})

const personSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  id: Date
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.phoneNumber}`)
    })
    mongoose.connection.close()
  })
}

else if (process.argv.length === 5) {
  const name = process.argv[3]
  const phoneNr = process.argv[4]

  const person = new Person({
    name: name,
    phoneNumber: phoneNr,
    id: new Date()
  })
  // console.log('person', person)

  person.save().then(res => {
    console.log('object:', `added ${name} number ${phoneNr} to phonebook`)
    mongoose.connection.close()
  }).catch(err => {
    console.log('err', err)
  })
} else {
  console.log('process.argv', process.argv)
  console.log('incorrect number of arguments there')
  process.exit(1)
}

