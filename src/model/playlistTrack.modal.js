const mongoose = require("mongoose");

// const trackDetailSchema = new mongoose.Schema({
//     trackName: { type: String },
//     previewURL: { type: String }
//   });

// const playlistTrackSchema = new mongoose.Schema({
//   email: {type: String, unique: true, required: true},
//     playListname: { type: String, unique: true, required: true },
//     trackDetails: [trackDetailSchema],
// });


const playlistTracksSchema = new mongoose.Schema({
  email: { type: String, required: true },
  playListDetail: [
    {
      playListname: {type: String,required: true },
      trackDetails: [{trackName: { type: String }, previewURL: { type: String },}],
    },
  ],
});


playlistTracksSchema.index({ email: 1, playListname: 1 }, { unique: true });


const PlaylistTracks = mongoose.model("playlistTrack", playlistTracksSchema);

module.exports = PlaylistTracks;
