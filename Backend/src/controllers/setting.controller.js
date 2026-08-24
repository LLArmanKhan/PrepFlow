import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";

// ALL CONTROLLERS ARE WORKING PROPERLY --> TESTED ON POSTMAN

export async function changepassword(req, res) {
  const { password, newpassword } = req.body;

  const user = await userModel.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      message: "User Does Not Exist",
    });
  }

  const compare = await bcrypt.compare(password, user.password);

  if (!compare) {
    return res.status(400).json({
      message: "Incorrect password",
    });
  }

  const hashpassword = await bcrypt.hash(newpassword, 10);

  user.password = hashpassword;
  await user.save();

  res.status(200).json({
    message: "Password Updated Successfully",
  });
}

export async function deleteAccount(req,res) {
    const {password}=req.body
    
    const user = await userModel.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      message: "User Does Not Exist",
    });
  }

  const compare = await bcrypt.compare(password, user.password);

  if (!compare) {
    return res.status(400).json({
      message: "Incorrect password",
    });
  }

  await userModel.findByIdAndDelete(req.userId)
  res.clearCookie("refreshToken")
  
  res.status(200).json({
    message:"Account Deleted Succesfully"
  })

}
