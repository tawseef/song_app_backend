const httpStatus = require("http-status");

const UserService = require("../service/user.service");
const UserServiceInstance = new UserService();

const { createPlaylist, getAllPlaylist, addTracksToPlaylist } = require("../service/playlist.service");

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
    // Storing token to cookie
    res.cookie("token", result.token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });

    res.json(result);
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
    else res.status(404).json({ message: "User not found or update failed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


// Playlist Creation
async function handlePlaylistCreation(req, res) {
  try {
    const response = await createPlaylist(req.body);  
    if (response) res.status(200).json(response);
    else res.status(400).json([]);
  } catch (e) {
    res
      .status(500)
      .json({ success: "false", message: "Internal server error" });
  }
}

async function handleAddTracks(req, res){
  try{
    const response = await addTracksToPlaylist(req.body);
    res.status(200).json(response.data);
  }catch(error){throw error}
}

module.exports = {
  handleGetAllPlayList,
  handleUserSignup,
  handleUserLogin,
  handlePlaylistCreation,
  handleAddTracks
};