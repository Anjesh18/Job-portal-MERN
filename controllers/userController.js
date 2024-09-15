import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({
          message: "User with this email already exists!",
          success: false,
        });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser=await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPass,
      role,
    });
    return res.status(201).json({messagee:"Account created successfully",success:true, newUser})
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorect email or password", success: false });
    }
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      return res
        .status(400)
        .json({ message: "Incorect password", success: false });
    }
    if (role !== user.role) {
      return res
        .status(400)
        .json({
          message: "Account does not exist for current role",
          success: false,
        });
    }

    const token = jwt.sign({ userId: user._id }, "secret123", {
        expiresIn: "24h",
    });
    const loggedinUser={
        _id:user._id,
        fullname:user.fullname,
        role:user.role,
        phoneNumber:user.phoneNumber,
        profile:user.profile
    }
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({ message: `Welcome back ${user.fullname}`, loggedinUser, success: true });
  } catch (error) {
    res.status(404).json({message:error.message})
  }
};


export const logout=async(req,res)=>{
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({message:"Logout successful", success: true})
    } catch (error) {
     console.log(error)   
    }
}

export const updateProfile=async(req,res)=>{
    try {
        const {fullname,email,phoneNumber,bio,skills}=req.body
        const file=req.file
        let skillsArray
        if(skills){
          skillsArray=skills.split(",")
        }
        
        const userId=req.id
        let user=await User.findByIdAndUpdate(userId,{
          fullname:fullname,
          email:email,
          phoneNumber: phoneNumber,
          bio: bio,
          skills:skillsArray
        })
        if(!user){
            return res.status(400).json({message:"User not found", success:false})
        }
       

        const updatedUser={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return res.status(201).json({message:"Successfully updated",sucess:true, updatedUser})
    } catch (error) {
        
    }
}