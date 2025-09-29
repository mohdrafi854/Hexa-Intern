const Comment = require("../model/Comment.model");
const Article = require("../model/Article.model");

const createComments = async (req, res) => {
  try {
    const { text, userId } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(400).json({ error: "Article not found" });
    }

    article.comments.push({ user: userId, text });
    await article.save();
    console.log(`Notification: New comment added on article ${article._id}`);
    res.json({ message: "Comment added", comments: article.comments });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const lockArticle = async (req, res) => {
  try {
    const { userId } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    if (article.isLocked && article.lockedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Article is locked by another user" });
    }

    article.isLocked = true;
    article.lockedBy = userId;
    await article.save();

    res.json({ message: "Article locked for editing" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const unlockArticle = async (req, res) => {
  try {
    const { userId } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    if (article.lockedBy.toString() !== userId) {
      return res.status(403).json({ error: "You cannot unlock this article" });
    }

    article.isLocked = false;
    article.lockedBy = null;
    await article.save();

    res.json({ message: "Article unlocked" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const lockCheckAndNotification = async (req, res) => {
  try {
    const { title, body, userId } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ error: "Article not found" });

    if (article.isLocked && article.lockedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Article is locked by another user" });
    }

    article.title = title || article.title;
    article.body = body || article.body;
    article.updatedAt = new Date();
    await article.save();

    console.log(`Notification: Article ${article._id} updated`);

    res.json({ message: "Article updated", article });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {createComments, lockArticle, unlockArticle, lockCheckAndNotification}