const Organization = require("../model/Organization.model");

const organization = async (req, res) => {
  try {
    const { name, settings } = req.body;

    if (!name || !settings) {
      return res.status(404).json({ error: "All fields are required" });
    }

    const organization = new Organization({ name, settings });
    await organization.save();

    res
      .status(201)
      .json({ message: "Organization create successfully.", organization });
  } catch (error) {
    console.error("Error Org", error.message);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

const listOrganization = async(req, res) => {
  try {
    const list = await Organization.find();
    res.status(201).json(list)
  } catch (error) {
    console.error("Org list not found", error.message);
    res.status(500).json({error: "Something went wrong"})
  }
}

module.exports = {organization, listOrganization}

