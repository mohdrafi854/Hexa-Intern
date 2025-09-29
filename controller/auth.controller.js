const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User.model");

const signup = async (req, res) => {
  try {
    const { organizationId, role, name, email, password } = req.body;
    if (!organizationId || !role || !name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ error: "Email already exist" });
    }

    console.log("Raw Password: ", password);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    

    const user = new User({
      name,
      email,
      password: hashedPassword,
      organizationId,
      role,
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, organizationId: user.organizationId },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    console.error("error creating user", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const listSignup = async (req, res) => {
  try {
    const list = await User.find().select("-password");
    res.status(200).json(list);
  } catch (error) {
    console.error("Error list of user", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existEmail = await User.findOne({ email });

    if (!existEmail) {
      return res.status(400).json({ error: "Email not found" });
    }

    console.log("Login password", password);
    console.log("DB Hash:", existEmail.password);

    const isPasswordMatch = await bcrypt.compare(password, existEmail.password);

    console.log("Password Match:", isPasswordMatch);
    
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    
    

    const token = jwt.sign({id:existEmail._id, email:existEmail.email, role:existEmail.role, organizationId: existEmail.organizationId}, process.env.JWT_SECRET, {expiresIn:"2d"})

    res.status(200).json({message:"Login Successfull", token})

  } catch (error) {
    console.error("Error loggin", error.message);
    res.status(500).json({error:"Something went Wrong!"})
  }
};

module.exports = { signup, listSignup, login };
