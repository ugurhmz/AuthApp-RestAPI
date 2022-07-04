const UserModel = require("../models/UserModel");
const httpStatus = require("http-status");

// REGISTER
exports.registerController = async (req, res) => {
  const { email, username, name, password } = req.body;
  console.log(req.body);

  try {
    const findUser = await UserModel.findOne({ email });
    if (findUser) {
      return res.status(httpStatus.CONFLICT).json({
        error: "E-mail already exist!",
      });
    }

    const newUser = new UserModel(req.body);
    const savedUser = await newUser.save();

    res.status(httpStatus.OK).json(savedUser);
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
};
