const asyncHandler = require("express-async-handler");
const User = require("../../database/models/userModel");
const generateToken = require("../congif/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Plase complete the form"); // code will stop here if condition is true, means this is like return statement
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

//------------------------------LOGIN API----------------
// this is to check email and password and let user login.
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  // console.log('line 43 userController',user.__proto__)
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
// const allUsers = asyncHandler(async (req, res) => {
//   const keyword = req.query.search
//     ? {
//         $or: [
//           { name: { $regex: req.query.search, $options: "i" } },
//           { email: { $regex: req.query.search, $options: "i" } },
//         ],
//       }
//     : {};

//   const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
//   res.send(users);
// });
//===---------------------GEt ALL USER API-------------------
const allUsers = asyncHandler(async (req, res) => {
  const searchQuery = req.query.search;
  const query = searchQuery
    ? {
        $and: [
          {
            $or: [
              { name: { $regex: searchQuery, $options: "i" } },
              { email: { $regex: searchQuery, $options: "i" } },
            ],
          },
          { _id: { $ne: req.user._id } },
        ],
      }
    : { _id: { $ne: req.user._id } };

  const users = await User.find(query);
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
