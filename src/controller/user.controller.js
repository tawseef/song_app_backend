const httpStatus = require("http-status");

const UserService = require("../service/user.service");
const UserServiceInstance = new UserService();

const {
  createPlaylist,
  getAllPlaylist,
  addTracksToPlaylist,
  getAllPlaylistData,
  deteleTracksFromPlaylist,
  deteleFullPlaylist
} = require("../service/playlist.service");

// Sign-up Function
async function handleUserSignup(req, res) {
  try {
    const user = await UserServiceInstance.signup(req.body);
    if (user){
      res.status(httpStatus.UNAUTHORIZED).json({
        "isLoggedIn": false
      });
    }else{
      res
        .status(httpStatus.OK)
        .json({ message: "Signup Successful", username: user.name });
    }
  } catch (error) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: error });
  }
}

// Login Function
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const result = await UserServiceInstance.login(email, password);
    if(result.isLoggedIn){
      res.status(httpStatus.OK).json(result);
    }else{
      res.status(httpStatus.UNAUTHORIZED).json({
        "isLoggedIn": false
    });
    }
  } catch (error) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Bad Request", error });
  }
}

// Get All Playlist
async function handleGetAllPlayList(req, res) {
  try {
    const {email} = req.query;
    const response = await getAllPlaylist(email);
    if (response) res.status(200).json(response);
    else res.status(httpStatus.NOT_FOUND).json({ message: "User not found or update failed" });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
  }
}

// Playlist Creation
async function handlePlaylistCreation(req, res) {
  try {
    const response = await createPlaylist(req.body);
    if (response) res.status(200).json(response);
    else res.status(httpStatus.NOT_FOUND).json([]);
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: "false", message: "Internal server error" });
  }
}

// Add Tracks to Playlist
async function handleAddTracks(req, res) {
  try {
    const response = await addTracksToPlaylist(req.body);
    res.status(httpStatus.OK).json(response.data);
  } catch (error) {
    throw error;
  }
}

// Get All Tracks Of All Playlist Of A User
async function handleGetAllTrackOfAllPlayList(req, res) {
  const {email} = req.query;
  try {
    const response = await getAllPlaylistData(email);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    throw error;
  }
}

// Delete Tracks From A Playlist
async function handleDeleteTracks(req, res) {
  try {
    const response = await deteleTracksFromPlaylist(req.body);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    throw error;
  }
}

async function handleDeletePlaylist(req, res) {
  try {
    const response = await deteleFullPlaylist(req.body);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  handleGetAllPlayList,
  handleUserSignup,
  handleUserLogin,
  handlePlaylistCreation,
  handleAddTracks,
  handleGetAllTrackOfAllPlayList,
  handleDeleteTracks,
  handleDeletePlaylist
};
