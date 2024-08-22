const mongoose = require("mongoose");

const playlistTracksSchema = new mongoose.Schema({
  email: { type: String, required: true },
  playListDetail: [
    {
      playListname: { type: String, default:"" },
      trackDetails: [{ trackName: { type: String }, previewURL: { type: String } }],
    },
  ],
});



const PlaylistTracks = mongoose.model("playlistTrack", playlistTracksSchema);

module.exports = PlaylistTracks;