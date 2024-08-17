const Playlist = require("../model/playlist.modal");
const User = require("../model/user.model");

const createPlaylist = async ({ email, playListname }) => {
  try {
    const findingUser = await User.findOne({ email: email });
    if (findingUser && findingUser.islogin) {
      const playlist = await Playlist.create({
        email: email,
        playListname: playListname,
      });

      return playlist;
    } else {
        return { message: "NO Playlist Created"};
    }
  } catch (error) {
    throw error;
  }
};

const getAllPlaylist = async ({ email }) =>{
    try{
        const findingUser = await User.findOne({ email: email });
        if (findingUser && findingUser.islogin) {
            const getPlaylist = await Playlist.find({email: email});
            return getPlaylist[0].playListname;
        } else {
            return { message: "No Playlist Found"};
        }
    }catch(error){ throw error }
}

module.exports = { createPlaylist, getAllPlaylist };