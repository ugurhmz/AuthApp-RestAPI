const UserModel = require("../models/UserModel");
const httpStatus = require("http-status");
const CryptoJs = require("crypto-js");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// REGISTER & E-MAIL verification
exports.registerController = async (req, res) => {
  const { email, username, name, password } = req.body;
  console.log(req.body);

  try {
    const findUser = await UserModel.findOne({
      $or: [
        {
          email: email,
        },
        {
          username: username,
        },
      ],
    });

    if (findUser) {
      return res.status(httpStatus.CONFLICT).json({
        error: "This a record already exists!, Pls change e-mail or username!",
      });
    }

    const token = jwt.sign(
      {
        email,
      },
      process.env.JWT_SECURITY,
      {
        expiresIn: "7d",
      }
    );

    const newUser = new UserModel({
      email: email,
      username: username,
      name: name,
      password: CryptoJs.AES.encrypt(
        req.body.password,
        process.env.PAS_HASH_SECURITY
      ),
      activationToken: token,
      isVerified: false,
    });
    const savedUser = await newUser.save();

    const emailInfo = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account activation link",
      html: `<h1>Please Click to activate your mail.</h1>
            <p>http://localhost:3500/ugurapi/user/activation/${token}</p>
            <hr/> `,
    };

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL_FROM}`,
        pass: `${process.env.EMAIL_PW}`,
      },
    });

    transporter
      .sendMail(emailInfo)
      .then((sent) => {
        return res.status(httpStatus.OK).json({
          message: `Activation link,  has been sent to your ${email}.`,
        });
      })
      .catch((err) => {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          errormsg: err,
        });
      });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
};

// ACTIVATION
exports.userActivationController = async (req, res) => {
  try {
    const paramToken = req.params.token;
    const findUser = await UserModel.findOne({ activationToken: paramToken });

    if (findUser) {
      findUser.activationToken = null;
      findUser.isVerified = true;
      const verifiedSavedUser = await findUser.save();
      return res.status(httpStatus.OK).json("Registration successful");
    } else {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json("E-mail not verified");
    }
  } catch (err) {
    res
      .status(httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS)
      .json("E-mail not verified");
  }
};

// LOGIN
exports.loginController = async (req, res) => {
  try {
    const findUser = await UserModel.findOne({ email: req.body.email });

    if (!findUser) {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "User not found, try again!",
      });
    }

    const decryptUserPassword = CryptoJs.AES.decrypt(
      findUser.password,
      process.env.PAS_HASH_SECURITY
    );

    const userDbPassword = decryptUserPassword.toString(CryptoJs.enc.Utf8);
    if (userDbPassword !== req.body.password) {
      return res.status(httpStatus.NOT_FOUND).json({
        error: "Your password is wrong please fix it!",
      });
    }

    const loginToken = jwt.sign(
      {
        id: findUser._id,
      },
      process.env.JWT_SECURITY,
      {
        expiresIn: "7d",
      }
    );

    const { password, ...exceptThePassword } = findUser._doc;
    res.status(httpStatus.OK).json({
      ...exceptThePassword,
      loginToken,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
};
