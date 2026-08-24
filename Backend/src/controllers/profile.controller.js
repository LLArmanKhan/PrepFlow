import userModel from "../models/user.model.js";


// ALL CONTROLLERS ARE WORKING HERE --> TESTED ON POSTMAN 

export async function getprofile(req, res) {
  const user = await userModel.findById(req.userId);

  res.status(200).json({
    message: "Profile Fetched Successfully",
    user: {
      username: user.username,
      email: user.email,
      targetRole: user.targetRole,
      collegeName: user.collegeName,
      currentYear : user.currentYear,
      leetcodeName: user.leetcodeName,
      gfgName: user.gfgName,
    },
  });
}

export async function updateProfile(req, res) {
  const { username, email, targetRole, collegeName, currentYear, leetcodeName, gfgName } =
    req.body;

  const updateData = {};
  if (username !== undefined) updateData.username = username;
  if (email !== undefined) updateData.email = email;
  if (targetRole !== undefined) updateData.targetRole = targetRole;
  if (collegeName !== undefined) updateData.collegeName = collegeName;
  if (currentYear !== undefined) updateData.currentYear = currentYear;
  if (leetcodeName !== undefined) updateData.leetcodeName = leetcodeName;
  if (gfgName !== undefined) updateData.gfgName = gfgName;

  const user = await userModel.findByIdAndUpdate(
    req.userId,
    { $set: updateData },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({
      message: "User Does Not Exist",
    });
  }

  res.status(200).json({
    message: "Profile Updated Successfully",
    updateData,
  });
}
