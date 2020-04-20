const mongoose = require('mongoose');
const validate = require('validator');
const userModel = require('./user');

// const ownerSchema = new mongoose.Schema({
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user',
//     required: true,
//   },
//   // name: {
//   //   type: String,
//   //   ref: 'user',
//   //   required: true,
//   // },
//   // about: {
//   //   type: String,
//   //   ref: 'user',
//   //   required: true,
//   // },
//   // avatar: {
//   //   type: String,
//   //   ref: 'user',
//   //   required: true,
//   // },
// });

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator(v) {
        return validate.isURL(v);
      },
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // owner: ownerSchema,
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);