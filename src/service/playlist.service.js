const User = require("../model/user.model");
const Playlist = require("../model/playlist.modal");
const PlaylistTracks = require("../model/playlistTrack.modal");

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
        console.log("playlist");
        const playlist = await Playlist.create({
          email: email,
          playListname: [playListname],
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
      if (Boolean(getPlaylist[0])) return getPlaylist[0].playListname;
      else return [];
    } else {
      return { message: "No Playlist Found" };
    }
  } catch (error) {
    throw error;
  }
};

// const addTracksToPlaylist = async (data) => {
//   const { playListname, email, trackName, previewURL } = data;
//   try {
//     const findingUser = await User.findOne({ email: email });
//     if (findingUser) {
//       const getPlaylistOfUser = await Playlist.find({ email: email });
//       if (getPlaylistOfUser) {
//         const findingInUserPlaylist = getPlaylistOfUser[0].playListname.includes(playListname);
//         console.log(findingInUserPlaylist)
//         if (!findingInUserPlaylist) {
//           const playlist = await PlaylistTracks.create({
//             email: email,
//             playListname: playListname,
//             trackDetails: {
//               trackName: trackName,
//               previewURL: previewURL,
//             },
//           });
//           return playlist;
//         } else {
//           console.log(">>>>>>>>>>>>>>>>>>>>>>>")
//           const playlist = await PlaylistTracks.findOne({email:email})
//           playlist.trackDetails.push({trackName: trackName, previewURL: previewURL});
//           await playlist.save();
//           return playlist;
//           // return { msg: "Create playlist first" };
//         }
//       } else {
//         return { msg: "Playlist not found" };
//       }
//     } else {
//       return { msg: "User not found" };
//     }
//   } catch (error) {
//     throw error;
//   }
// };




const addTracksToPlaylist = async (data) => {
  const { playListname, email, trackName, previewURL } = data;
  try {
    const findingUser = await User.findOne({ email: email });
    if (findingUser) {
      const getPlaylistOfUser = await Playlist.findOne({ email: email, playListname: playListname });
      if (getPlaylistOfUser) {
        const playlist = await PlaylistTracks.findOne({ email: email, playListname: playListname });
        if (playlist) {
          if (Array.isArray(playlist.trackDetails)) {
            playlist.trackDetails.push({ trackName: trackName, previewURL: previewURL });
          } else {
            playlist.trackDetails = [{ trackName: trackName, previewURL: previewURL }];
          }
          await playlist.save();
          return playlist.trackDetails;
        } else {
          const newPlaylist = await PlaylistTracks.create({
            email: email,
            playListname: playListname,
            trackDetails: [{ trackName: trackName, previewURL: previewURL }],
          });
          return newPlaylist;
        }
      } else {
        return { msg: "Playlist not found" };
      }
    } else {
      return { msg: "User not found" };
    }
  } catch (error) {
    throw error;
  }
};



module.exports = { createPlaylist, getAllPlaylist, addTracksToPlaylist };
