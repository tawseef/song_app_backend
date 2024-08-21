const express = require("express");

const router = express.Router();
const {handleUserSignup, handleUserLogin, handlePlaylistCreation, handleGetAllPlayList, handleAddTracks, handleGetAllTrackOfAllPlayList, handleDeleteTracks, handleDeletePlaylist } = require("../controller/user.controller");

const { validateSchema } = require("../middleware/validate.middleware");

const { signUpBodyValidation } = require("../validation/auth.validation");
const { loginBodyValidaton } = require("../validation/auth.validation");

const validateSignup = validateSchema(signUpBodyValidation);
const validateLogin = validateSchema(loginBodyValidaton);

router.post("/signup", validateSignup, handleUserSignup);
router.post("/login", validateLogin, handleUserLogin);
router.post("/createPlaylist", handlePlaylistCreation);
router.get("/getAllPlaylists", handleGetAllPlayList);
router.get("/getTracksDetailsOfAllPlaylists", handleGetAllTrackOfAllPlayList);
router.post("/addTracksToPlaylist", handleAddTracks);
router.delete("/deleteTracksFromPlaylist", handleDeleteTracks);
router.delete("/deleteWholePlaylist", handleDeletePlaylist);

module.exports = router;