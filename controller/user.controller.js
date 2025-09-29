const User = require("../model/User.model");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { organizationId } = req.params;
    if (!name || !email || !password || !role) {
      return res.status(400).json({error: "All fields are required"});
    }

    const allowedRoles = ["admin", "editor", "viewer"];
    if(!allowedRoles.includes(role.toLowerCase())){
        return res.status(400).json({error:"Invalid role"})
    }

    const existingUser = await User.find({email, organizationId})
    if(existingUser){
        return res.status(400).json({error:"User already exist in this org"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({name, email, password:hashedPassword, role:role.toLowerCase(), organizationId});
    await user.save();

    res.status(201).json({message: "User created successfully", user})
  } catch (error) {
    console.error("createdUser Error", error.message);
    res.status(500).json({error:"Server error while creating user"})
  }
};

const deleteUser = async(req, res) => {
    try {
        const {organizationId, userId} = req.params
        const user = await User.findOneAndDelete({_id:userId, organizationId})
        if(!user){
            res.status(404).json({error:"User not found in this org"})
        }

        res.json({message:"User removed successfully", user})
    } catch (error) {
        console.error("Delete User", error.message);
        res.status(500).json({error:"Something went wrong"})
    }
}

const updateRole = async(req, res) => {
    try {
        const{organizationId, userId} = req.params
        const {role} = req.body

        const allowedRoles = ["admin", "editor", "viewer"]
        if(!allowedRoles.includes(role.toLowerCase())){
            return res.status(400).json({error: "Invalid Role"})
        }
        const user = await User.findOne({_id:userId, organizationId})
        if(!user){
            return res.status(400).json({error:"User not found in this org"})
        }
        user.role = role.toLowerCase()
        await user.save();
        return res.status(201).json({message:"role update successfully", user})
    } catch (error) {
        console.error("UpdateRole", error.message);
        res.status(500).json({error:"Server Error"})
    }
}

module.exports = {createUser, deleteUser, updateRole}
