const Article = require("./articles.schema");

class ArticleService {
  getAll() {
    return Article.find();
  }
  get(id) {
    return Article.findById(id);
  }
  create(data) {
    const article = new Article(data);
    return article.save();
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id) {
    return Article.deleteOne({ _id: id });
  }
  async displayArticles(id) {
    try{
      const articles = await Article.find({ user: id }).populate('user','-password');
      return articles
    } catch(err){
      throw err;
    }
  }
}

module.exports = new ArticleService();
