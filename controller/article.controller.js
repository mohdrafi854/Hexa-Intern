const Article = require("../model/Article.model");

const article = async (req, res) => {
  try {
    const { title, body, tags, attachments } = req.body;
    const { organizationId } = req.user;
    const authorId = req.user;
    if (!title || !body) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const article = new Article({
      title,
      body,
      tags: tags || [],
      attachments: attachments || [],
      author: authorId,
      organizationId,
      status: "draft",
    });
    await article.save();
    res.status(201).json({ message: "Article created", article });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const listArticle = async (req, res) => {
  try {
    const {organizationId} = req.user;
    const article = await Article.find({organizationId}).populate("author", "name email role");
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { title, body, tags, attachments, status } = req.body;
    const { organizationId } = req.user;

    const article = await Article.findOne({ _id: articleId, organizationId });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    if (title) article.title = title;
    if (body) article.body = body;
    if (tags) article.tags = tags;
    if (attachments) article.attachments = attachments;
    if (status) article.status = status;

    await article.save();
    res.status(201).json({message:"Article update successfull", article})
  } catch (error) {
    console.error("Update article error", error);
    res.status(500).json({error:"Server Error while update article"})
  }
};

const deleteArticle = async(req, res) => {
  try {
    const {articleId} = req.params;
    const {organizationId} = req.user
    const article =  await Article.findByIdAndDelete({_id:articleId, organizationId});
    if(!article){
      return res.status(404).json({error:"Article not found"})
    }

    res.status(201).json({message:"Article delete successfull", article})
  } catch (error) {
    console.error("Article Delete Error", error);
    res.status(500).json({error:"Server Error"})
  }
}

module.exports = { article, listArticle, updateArticle, deleteArticle };
