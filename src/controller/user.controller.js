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
    res
      .status(httpStatus.OK)
      .json({ message: "Signup Successful", username: user.name });
  } catch (error) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Check credential", error });
  }
}

// Login Function
async function handleUserLogin(req, res) {
  try {
    const result = await UserServiceInstance.login(req.body);
    // console.log(result);
    // Storing token to cookie
    // res.cookie("token", result.token, {
    //   maxAge: 60 * 60 * 1000,
    //   httpOnly: true,
    // });
    res.status(httpStatus.OK).json(result);
  } catch (error) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "User does not exist", error });
  }
}

// Get All Playlist
async function handleGetAllPlayList(req, res) {
  try {
    // const email = req.query.email;
    const email = "test@mail.com";
    const response = await getAllPlaylist({ email });
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
    // console.log("response.data");
    res.status(httpStatus.OK).json(response.data);
  } catch (error) {
    throw error;
  }
}

// Get All Tracks Of All Playlist Of A User
async function handleGetAllTrackOfAllPlayList(req, res) {
  const email = "test@mail.com";
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
