import Article from '#models/article'
import NotFoundErrorException from '#exceptions/not_found_error_exception'

export default class ArticleService {
  async create({
    title,
    content,
    author,
  }: {
    title: string
    content: string
    author: string | null
  }): Promise<Article> {
    let newArticle = new Article()
    newArticle.title = title
    newArticle.content = content
    newArticle.author = author
    newArticle = await newArticle.save()
    return newArticle
  }

  async findAll({
    pageSize = 10,
    pageNumber = 10,
    search,
  }: {
    pageSize?: number
    pageNumber?: number
    search?: string
  }): Promise<Article[]> {
    if (search) {
      return Article.query().whereILike('title', search).paginate(pageSize, pageNumber)
    }
    return Article.query().paginate(pageSize, pageNumber)
  }

  async getById({ id }: { id: string }) {
    let article = await Article.find(id)
    if (!article) {
      throw new NotFoundErrorException('Article not found')
    }
    return article
  }
}
