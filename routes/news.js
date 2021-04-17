const express = require('express')
const News = require('./../models/news')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('news/new', { news: new News() })
})

router.get('/edit/:id', async (req, res) => {
  const news = await News.findById(req.params.id)
  res.render('news/edit', { news: news })
})

router.get('/:slug', async (req, res) => {
  const news = await News.findOne({ slug: req.params.slug })
  if (news == null) res.redirect('/')
  res.render('news/show', { news: news })
})

router.post('/', async (req, res, next) => {
  req.news = new News()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.news = await News.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await News.findByIdAndDelete(req.params.id)
  res.redirect('/news')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let news = req.news
    news.title = req.body.title
    news.author = req.body.author
    news.description = req.body.description
    news.markdown = req.body.markdown
    try {
      news = await news.save()
      res.redirect(`/news/${news.slug}`)
    } catch (e) {
      res.render(`news/${path}`, { news: news })
    }
  }
}

module.exports = router