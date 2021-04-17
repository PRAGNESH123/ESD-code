const express = require('express')
const Papers = require('./../models/paper')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('papers/new', { papers: new Papers() })
})

router.get('/edit/:id', async (req, res) => {
  const papers = await Papers.findById(req.params.id)
  res.render('papers/edit', { papers: papers })
})

router.get('/:slug', async (req, res) => {
  const papers = await Papers.findOne({ slug: req.params.slug })
  if (papers == null) res.redirect('/')
  res.render('papers/show', { papers: papers })
})

router.post('/', async (req, res, next) => {
  req.papers = new Papers()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.papers = await Papers.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Papers.findByIdAndDelete(req.params.id)
  res.redirect('/papers')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let papers = req.papers
    papers.title = req.body.title
    papers.author = req.body.author
    papers.description = req.body.description
    papers.markdown = req.body.markdown
    try {
      papers = await papers.save()
      res.redirect(`/papers/${papers.slug}`)
    } catch (e) {
      res.render(`papers/${path}`, { papers: papers })
    }
  }
}

module.exports = router