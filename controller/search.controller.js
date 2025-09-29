const Article = require("../model/Article.model");

const search = async (req, res) => {
  try {
    const { q, tags, author, start, end, orgId } = req.query;

    if (!orgId) return res.status(400).json({ error: "orgId is required" });

    const query = { orgId: mongoose.Types.ObjectId(orgId) };

    if (q) {
      query.$text = { $search: q };
    }

    if (tags) {
      const tagArr = tags.split(",");
      query.tags = { $in: tagArr };
    }

    if (author) query.author = mongoose.Types.ObjectId(author);

    if (start || end) {
      query.createdAt = {};
      if (start) query.createdAt.$gte = new Date(start);
      if (end) query.createdAt.$lte = new Date(end);
    }

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ results: articles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const recommend = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    
    const related = await Article.find({
      _id: { $ne: article._id },
      orgId: article.orgId,
      tags: { $in: article.tags },
    })
      .limit(5)
      .sort({ createdAt: -1 });

    res.json({ related });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {search, recommend}