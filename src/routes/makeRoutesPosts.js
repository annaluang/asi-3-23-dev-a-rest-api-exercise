import PostModel from "../db/models/PostModel.js"
import validate from "../middlewares/validate.js"
import { NotFoundError } from "../errors.js"
import { sanitizePost } from "../sanitizers.js"
import mw from "../middlewares/mw.js"
import {
  idValidator,
  titleValidator,
  contentValidator,
  queryLimitValidator,
  queryOffsetValidator,
} from "../validators.js"

const makeRoutesPosts = ({ app, db }) => {
  const checkIfPostExists = async (postId) => {
    const post = await PostModel.query().findById(postId)

    if (post) {
      return post
    }

    throw new NotFoundError()
  }
  app.get(
    "/posts",
    validate({
      query: {
        limit: queryLimitValidator,
        offset: queryOffsetValidator,
      },
    }),

    mw(async (req, res) => {
      const { limit, offset } = req.data.query
      const posts = await PostModel.query().limit(limit).offset(offset)
      res.send({
        result: sanitizePost(posts),
      })
    })
  )
  app.get(
    "/posts/:postId",
    validate({
      params: { postId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { postId } = req.data.params
      const post = await PostModel.query().findById(postId)

      if (!post) {
        return
      }

      res.send({ result: sanitizePost(post) })
    })
  )
  app.post(
    "/posts",
    validate({
      body: {
        titleValidator,
        contentValidator,
      },
    }),

    mw(async (req, res) => {
      const { title, content } = req.data.body
      const [post] = await db("posts")
        .insert({
          title,
          content,
        })
        .returning("*")

      res.send({ result: sanitizePost(post) })
    })
  )
  app.post(
    "/posts/:postId",
    validate({
      body: {
        titleValidator: titleValidator.required(),
        contentValidator: contentValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { title, content } = req.data.body
      const [post] = await db("posts").where({ title, content }).returning("*")

      res.send({ result: sanitizePost(post) })
    })
  )
  app.patch(
    "/posts/:postId",

    validate({
      params: { postId: idValidator.required() },
      body: {
        title: titleValidator,
        content: contentValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        data: {
          body: { title, content },
          params: { postId },
        },
      } = req

      const updatedPost = await PostModel.query().updateAndFetchById(postId, {
        ...(title ? { title } : {}),
        ...(content ? { content } : {}),
      })
      res.send({ result: sanitizePost(updatedPost) })
    })
  )
  app.delete(
    "/posts/:postId",
    validate({
      params: { postId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { postId } = req.data.params
      const post = await checkIfPostExists(postId, res)

      if (!post) {
        return
      }

      await PostModel.query().deleteById(postId)

      res.send({ result: sanitizePost(post) })
    })
  )
}

export default makeRoutesPosts
