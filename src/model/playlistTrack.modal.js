const mongoose = require("mongoose");

const trackDetailSchema = new mongoose.Schema({
    trackName: { type: String },
    previewURL: { type: String }
  });

const playlistTrackSchema = new mongoose.Schema({
  email: {type: String, unique: true, required: true},
    playListname: { type: String, unique: true, required: true },
    trackDetails: [trackDetailSchema],
});

const PlaylistTracks = mongoose.model("playlistTrack", playlistTrackSchema);

module.exports = PlaylistTracks;
