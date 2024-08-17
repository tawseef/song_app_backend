const mongoose = require("mongoose");
const validator = require("validator");

const playlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => validator.isEmail(value),
  },
  playListname: [{ type: String, unique: true, required: true }]
});

const Playlist = mongoose.model("playlist", playlistSchema);

module.exports = Playlist;