import { inject } from '@adonisjs/core'
import ArticleService from './article_service.js'
import { HttpContext } from '@adonisjs/core/http'
import { getAllArticleDto } from './dto/get_all_article_dto.js'
import DefaultResponseBuilder from '#utils/default_response_builder'

@inject()
export default class ArticleController {
  constructor(protected readonly articleService: ArticleService) {}

  async getAllArticles({ request }: HttpContext) {
    let payload = await request.validateUsing(getAllArticleDto)
    let articles = await this.articleService.findAll({
      pageNumber: payload.params.page,
      pageSize: payload.params.perPage,
      search: payload.params.searchTerm,
    })

    return new DefaultResponseBuilder<typeof articles>()
      .setStatusCode(200)
      .setData(articles)
      .setSuccess(true)
      .build()
  }

  async getArticleById({ params }: HttpContext) {
    let article = await this.articleService.getById({ id: params.id })
    return new DefaultResponseBuilder<typeof article>()
      .setStatusCode(200)
      .setData(article)
      .setSuccess(true)
      .build()
  }
}
