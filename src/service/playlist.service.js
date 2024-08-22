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
    let playlistTracks = await PlaylistTracks.findOne({ email });
    if (playlistTracks) {
      const existingPlaylist = playlistTracks.playListDetail.find(
        (pl) => pl.playListname === playListname
      );
      if (existingPlaylist) {
        return { success: false, msg: "Playlist name already exists" };
      }
      playlistTracks.playListDetail.push({
        playListname: playListname,
        trackDetails: [],
      });
      await playlistTracks.save();
    } else {
      await createInPlaylistTracks(email, playListname);
    }
    const findingPlaylist = await Playlist.findOne({ email });
    if (findingPlaylist) {
      if (!findingPlaylist.playListname.includes(playListname)) {
        findingPlaylist.playListname.push(playListname);
        await findingPlaylist.save();
      }
    } else {
      const newPlaylist = await createInPlaylist(email, playListname);
      console.log("Playlist document created:", newPlaylist);
    }

    return { success: true, msg: "Playlist created successfully" };
  } catch (error) {
    console.error("Error in createPlaylist:", error);
    return { success: false, msg: "An error occurred", error };
  }
};

const createInPlaylist = async (email, playListname) => {
  try {
    const newPlaylist = await Playlist.create({
      email,
      playListname: [playListname],
    });
    return newPlaylist;
  } catch (error) {
    console.error("Error in createInPlaylist:", error);
    throw error;
  }
};


const createInPlaylistTracks = async (email, playList) => {
  try {
    if (!playList || playList.trim() === '') {
      throw new Error("playListname cannot be null or empty");
    }
    const existingPlaylistTracks = await PlaylistTracks.findOne({ email: email });
    if (existingPlaylistTracks) {
      const existingPlaylist = existingPlaylistTracks.playListDetail.find((pl) => pl.playListname === playList);
      if (existingPlaylist) {
        throw new Error("Playlist name already exists");
      }
      existingPlaylistTracks.playListDetail.push({
        playListname: playList,
        trackDetails: [],
      });
      await existingPlaylistTracks.save();
    } else {
      const newPlaylistTracks = new PlaylistTracks({
        email,
        playListDetail: [
          {
            playListname: playList,
            trackDetails: [],
          },
        ],
      });
      await newPlaylistTracks.save();
    }
    return { success: true, msg: "Playlist created successfully" };
  } catch (error) {
    console.error("Error in createInPlaylistTracks:", error);
    throw error;
  }
};


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
