const Organization = require("../model/Organization.model");


const updateOrgSettings = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { settings } = req.body;

    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ error: "Settings must be provided as an object" });
    }

    const org = await Organization.findById(organizationId);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    
    org.settings = { ...org.settings, ...settings };
    await org.save();

    res.json({
      message: "Organization settings updated successfully",
      organization: {
        id: org._id,
        name: org.name,
        settings: org.settings,
      },
    });
  } catch (error) {
    console.error("UpdateOrgSettings Error:", error);
    res.status(500).json({ error: "Server error while updating organization settings" });
  }
};

module.exports = { updateOrgSettings };
