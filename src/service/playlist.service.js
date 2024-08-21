const User = require("../model/user.model");
const Playlist = require("../model/playlist.modal");
const PlaylistTracks = require("../model/playlistTrack.modal");

// Function to create a new playlist for a user
const createPlaylist = async ({ email, playListname }) => {
  try {
    const findingUser = await User.findOne({ email });
    if (!findingUser) {
      return { success: false, msg: "No user found" };
    }
    let findingPlaylist = await Playlist.findOne({ email });
    if (findingPlaylist) {
      if (!findingPlaylist.playListname.includes(playListname)) {
        findingPlaylist.playListname.push(playListname);
        await findingPlaylist.save();
        let playlistTracks = await PlaylistTracks.findOne({ email });
        if (playlistTracks) {
          playlistTracks.playListDetail.push({
            playListname: playListname,
            trackDetails: [],
          });
          await playlistTracks.save();
        } else {
          await PlaylistTracks.create({
            email: email,
            playListDetail: [
              {
                playListname: playListname,
                trackDetails: [],
              },
            ],
          });
        }   
        return { success: true, msg: "Playlist created", data: findingPlaylist.playListname };
      } else {
        return { success: false, msg: "Playlist name already exists" };
      }
    } else {
      const playlist = await Playlist.create({
        email,
        playListname: [playListname],
      });
        await PlaylistTracks.create({
        email,
        playListDetail: [
          {
            playListname: playListname,
            trackDetails: [],
          },
        ],
      });
      return { success: true, msg: "Playlist created and added to PlaylistTracks", data: playlist };
    }
  } catch (error) {
    return { success: false, msg: "An error occurred", error };
  }
}


// Function to get all playlists of a user
const getAllPlaylist = async (email) => {
  try {
    const findingUser = await User.findOne({ email: email });
    if (findingUser) {
      const getPlaylist = await Playlist.find({ email: email });
      if (getPlaylist[0].playListname.length > 0) return getPlaylist[0].playListname;
      else return [];
    } else {
      return { message: "No Playlist Found" };
    }
  } catch (error) {
    throw error;
  }
};


/////  Add tracks to playlist
const addTracksToPlaylist = async (data) => {
  const { playListname, email, trackName, previewURL } = data;
  try {
    const findingUser = await User.findOne({ email });
    if (!findingUser) {
      return { success: false, msg: "User not found" };
    }
    let playlistTracks = await PlaylistTracks.findOne({ email });
    if (playlistTracks) {
      const existingPlaylist = playlistTracks.playListDetail.find(
        (playlist) => playlist.playListname === playListname
      );

      if (existingPlaylist) {
        existingPlaylist.trackDetails.push({ trackName, previewURL });
        await playlistTracks.save();
        return {
          success: true,
          msg: "Track added to the existing playlist",
          data: existingPlaylist.trackDetails,
        };
      } else {
        return { success: false, msg: "Playlist not found in PlaylistTracks" };
      }
    } else {
      return { success: false, msg: "PlaylistTracks document not found" };
    }
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, msg: "A playlist with this name already exists for this user." };
    }
    return { success: false, msg: "An error occurred", error };
  }
};

// Get All Playlist for a USER
const getAllPlaylistData= async (email) =>{
  try{
    const findData = await PlaylistTracks.findOne({email:email})
    return findData;
  }catch(error){throw error}
}

// Delete Tracks
const deteleTracksFromPlaylist = async (data) => {
  const { email, playListname, trackName, previewURL } = data;
  try {
    const updatedPlaylist = await PlaylistTracks.findOneAndUpdate(
      { email, "playListDetail.playListname": playListname },
      {
        $pull: {
          "playListDetail.$.trackDetails": { trackName, previewURL } 
        }
      },
      { new: true } 
    );

    if (!updatedPlaylist) {
      throw new Error('Playlist or track not found');
    }
    return updatedPlaylist;
  } catch (error) {
    console.error('Error deleting track:', error);
    throw error;
  }
}

// Delete Full Playlist
const deteleFullPlaylist = async (data) =>{
  const {email, playListname} = data
  try {
    const playlistTracksResult = await PlaylistTracks.updateOne(
      { email },
      { $pull: { playListDetail: { playListname: playListname } } }
    );
    const playlistResult = await Playlist.updateOne(
      { email },
      { $pull: { playListname: playListname } }
    );
    if (playlistTracksResult.modifiedCount === 0 && playlistResult.modifiedCount === 0) {
      return { message: "No playlist found to delete." };
    }

    return { message: "Playlist deleted successfully." };
  } catch (error) {
    throw error;
  }
}


module.exports = { createPlaylist, getAllPlaylist, addTracksToPlaylist, getAllPlaylistData, deteleTracksFromPlaylist, deteleFullPlaylist };
