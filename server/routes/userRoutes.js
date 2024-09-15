const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");  
const { protect } = require("../middleware/authMiddleware");
//router.route help in chaining the route
// same func can be written as
//router.post('/',registerUser)
router.route("/").get(protect, allUsers).post(registerUser);
router.route("/login").post(authUser);

module.exports = router;
