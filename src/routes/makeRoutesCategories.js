import CategorieModel from "../db/models/CategorieModel.js"
import validate from "../middlewares/validate.js"
import { NotFoundError } from "../errors.js"
import { sanitizeCategory } from "../sanitizers.js"
import mw from "../middlewares/mw.js"
import {
  idValidator,
  nameCategorieValidator,
  queryLimitValidator,
  queryOffsetValidator,
} from "../validators.js"

const makeRoutesCategories = ({ app, db }) => {
  const checkIfCategorieExists = async (categorieId) => {
    const categorie = await CategorieModel.query().findById(categorieId)

    if (categorie) {
      return categorie
    }

    throw new NotFoundError()
  }

  app.get(
    "/categories",
    validate({
      query: {
        limit: queryLimitValidator,
        offset: queryOffsetValidator,
      },
    }),

    mw(async (req, res) => {
      const { limit, offset } = req.data.query
      const categories = await CategorieModel.query()
        .limit(limit)
        .offset(offset)
      res.send({
        result: sanitizeCategory(categories),
      })
    })
  )
  app.get(
    "/categories/:categorieId",
    validate({
      params: { categorieId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { categorieId } = req.data.params
      const categorie = await CategorieModel.query().findById(categorieId)

      if (!categorie) {
        return
      }

      res.send({ result: sanitizeCategory(categorie) })
    })
  )
  app.post(
    "/categories",
    validate({
      body: {
        nameCategorieValidator,
      },
    }),

    mw(async (req, res) => {
      const { nameCategorie } = req.data.body
      const [categorie] = await db("categories")
        .insert({
          nameCategorie,
        })
        .returning("*")

      res.send({ result: sanitizeCategory(categorie) })
    })
  )
  app.post(
    "/categories/:categorieId",
    validate({
      body: {
        nameCategorieValidator: nameCategorieValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { nameCategorie } = req.data.body
      const [categorie] = await db("categories")
        .where({ nameCategorie })
        .returning("*")

      res.send({ result: sanitizeCategory(categorie) })
    })
  )
  app.patch(
    "/categories/:categorieId",

    validate({
      params: { categorieId: idValidator.required() },
      body: {
        nameCategorie: nameCategorieValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        data: {
          body: { nameCategorie },
          params: { categorieId },
        },
      } = req

      const updatedCategorie = await CategorieModel.query().updateAndFetchById(
        categorieId,
        {
          ...(nameCategorie ? { nameCategorie } : {}),
        }
      )
      res.send({ result: sanitizeCategory(updatedCategorie) })
    })
  )
  app.delete(
    "/categories/:categorieId",
    validate({
      params: { categorieId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { categorieId } = req.data.params
      const categorie = await checkIfCategorieExists(categorieId, res)

      if (!categorie) {
        return
      }

      await CategorieModel.query().deleteById(categorieId)

      res.send({ result: sanitizeCategory(categorie) })
    })
  )
}

export default makeRoutesCategories
