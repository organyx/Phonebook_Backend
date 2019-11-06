const mongoose = require('mongoose')
const uniqVal = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('...', url)

mongoose.connect(url, { useNewUrlParser: true }).then(res => {
  console.log('Connection Successfull')
}).catch(err => {
  console.log('Error', err)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 8
  },
})

personSchema.plugin(uniqVal)

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)