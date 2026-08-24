import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateOTP, getOTPHtml } from "../utils/util.js";
import { sendEmail } from "../services/email.service.js";
import otpModel from "../models/otp.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";

// ALL CONTROLLERS ARE WORKING --> TESTED ON POSTMAN 

export async function registerUser(req, res) {
  const { username, email, targetRole, collegeName, currentYear, leetcodeName, gfgName, password } = req.body;

  const userExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    return res.status(401).json({
      message: "User Already Exists",
    });
  }

  const hashpass = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    targetRole,
    collegeName,
    currentYear,
    leetcodeName,
    gfgName,
    password: hashpass,
    verified: false,
  });

  const otp = generateOTP();
  const otphtml = getOTPHtml(otp);

  const hashotp = await bcrypt.hash(String(otp), 10);

  await otpModel.deleteMany({
    email,
  });

  await otpModel.create({
    email,
    hashotp,
  });

  await sendEmail(email, "Verification Code", `Your OTP is : ${otp}`, otphtml);

  res.status(200).json({
    message: "OTP Sent Successfully",
  });
}

export async function login(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(401).json({
      message: "You are not a registered User",
    });
  }

  if (user.verified != true) {
    return res.status(401).json({
      message: "Please verify your Email first",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({
      message: "Incorrect Password",
    });
  }

  const refreshToken = await jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  const session = await sessionModel.create({
    userId: user._id,
    refreshToken: hashedRefreshToken,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = await jwt.sign(
    {
      user: user._id,
      session: session.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    message: "Logged In Successfully",
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
    accessToken,
  });
}

export async function logout(req,res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(409).json({
      message: "Please Login again",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    if (!decoded) {
      return res.status(409).json({
        message: "Unauthorized",
      });
    }

    const sessions = await sessionModel.find({
      userId: decoded.id,
      revoked: false,
    });

    let session=null
    for (const s of sessions) {
      const match = await bcrypt.compare(refreshToken, s.refreshToken);
      if (match) {
        session = s;
        break;
      }
    }

    if (!session) {
      return res.status(404).json({
        message: "Please login Again",
      });
    }

    session.revoked=true
    await session.save()

    res.clearCookie("refreshToken");

  res.status(200).json({
    message: "Logged Out Successfully",
  });
  }
    catch(err){
      console.error("Error : ",err.message);
    }
}

export async function logoutAll(req,res) {
  const refreshToken = req.cookies.refreshToken

  if(!refreshToken){
    return res.status(404).json({
      message:"No Token Found"
    })
  }

  try{
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET)

    if(!decoded){
      return res.status(404).json({
      message:"Invalid JWT Token"
    })
    }

    const sessions = await sessionModel.updateMany({
      userId:decoded.id,
      revoked:false
    },{
      $set : {revoked:true},
    })

    res.clearCookie("refreshToken")

    res.status(200).json({
      message:"Logged Out Of All Devices Successfully"
    })
  }catch(err){
    console.error("Error : ",err.message);
  }
}

export async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(409).json({
      message: "Please Login again",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    if (!decoded) {
      return res.status(409).json({
        message: "Unauthorized",
      });
    }

    const sessions = await sessionModel.find({
      userId: decoded.id,
      revoked: false,
    });

    let session=null
    for (const s of sessions) {
      const match = await bcrypt.compare(refreshToken, s.refreshToken);
      if (match) {
        session = s;
        break;
      }
    }

    if (!session) {
      return res.status(404).json({
        message: "Please login Again",
      });
    }

    const accessToken = await jwt.sign(
      {
        id: decoded.id,
        sessionId: session._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const newrefreshToken = await jwt.sign(
      {
        id: decoded.id, // token me id naam ka variable create hoga jiski value user ki id hogi
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const newHashRefreshToken = await bcrypt.hash(newrefreshToken, 10);

    session.refreshToken = newHashRefreshToken;
    await session.save();

    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Access Token Generated Successfully",
      accessToken,
    });
  } catch (err) {
    console.error("Error : ", err.message);
  }
}

export async function verifyEmail(req, res) {
  const { email, otp } = req.body;

  const otpDoc = await otpModel.findOne({
    email,
  });

  if (!otpDoc) {
    return res.status(401).json({ message: "OTP not found or expired" });
  }

  const otpMatch = await bcrypt.compare(String(otp), otpDoc.hashotp);
  if (!otpMatch) {
    return res.status(401).json({
      message: "Incorrect OTP",
      otp: otpMatch,
    });
  }

  const user = await userModel.findOne({
    email,
  });

  user.verified = true;
  await user.save();

  res.status(200).json({
    message: "Email Verified SuccessFully",
  });
}
