const mongoose = require("mongoose");

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
