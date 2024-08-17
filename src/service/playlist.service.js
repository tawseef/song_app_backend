const Playlist = require("../model/playlist.modal");
const User = require("../model/user.model");

const createPlaylist = async ({ email, playListname }) => {
  try {
    const findingUser = await User.findOne({ email: email });
    if (findingUser) {
      const findingPlaylist = await Playlist.findOne({ email: email });
      if (findingPlaylist) {
        if (!findingPlaylist.playListname.includes(playListname)) {
          findingPlaylist.playListname.push(playListname);
          await findingPlaylist.save();
          return findingPlaylist.playListname;
        } else {
          return { message: "Playlist name already exists" };
        }
      } else {
        const playlist = await Playlist.create({
          email: email,
          playListname: playListname,
        });
        return playlist;
      }
    } else {
      return { message: "No user found" };
    }
  } catch (error) {
    throw error;
  }
};

const getAllPlaylist = async ({ email }) => {
  try {
    const findingUser = await User.findOne({ email: email });
    if (findingUser) {
      const getPlaylist = await Playlist.find({ email: email });
      return getPlaylist[0].playListname;
    } else {
      return { message: "No Playlist Found" };
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { createPlaylist, getAllPlaylist };
