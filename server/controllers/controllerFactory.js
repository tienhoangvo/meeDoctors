import catchPromises from './../utils/catchPromises'
import AppError from '../utils/appError'
import QueryFeatures from './../utils/queryFeatures'

export const listAll = (Model) => {
  return catchPromises(async (req, res, next) => {
    console.log('FROM LISTALL', req.query)
    const query = new QueryFeatures(
      Model.find(),
      req.query
    )
      .search()
      .filter()
      .limitFields()
      .paginate()
      .sort()

    const documents = await query.query

    console.log({ documents })
    const resObj = {
      status: 'success',
      results: documents.length,
      page: query.page,
      limit: query.limit,
    }

    resObj[Model.collection.collectionName] = documents

    res.status(200).json(resObj)
  })
}

export const getOne = (Model) => {
  return catchPromises(async (req, res, next) => {
    const document = await Model.findById(
      req.params.id
    )

    if (!document)
      return next(
        new AppError(
          'No doccument found with that given ID',
          404
        )
      )

    const resObj = { status: 'success' }
    const collectionName =
      Model.collection.collectionName
    const responceDocumentName = collectionName.replace(
      /s{1}$/,
      ''
    )
    resObj[responceDocumentName] = document
    res.status(200).json(resObj)
  })
}

export const createOne = (Model) => {
  return catchPromises(async (req, res, next) => {
    const document = await Model.create(req.body)
    const resObj = { status: 'success' }
    const collectionName =
      Model.collection.collectionName
    const responceDocumentName = collectionName.replace(
      /s{1}$/,
      ''
    )
    resObj[responceDocumentName] = document

    res.status(201).json(resObj)
  })
}

export const updateOne = (Model) => {
  return catchPromises(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!document)
      return next(
        new AppError(
          'No document found with that ID',
          404
        )
      )

    const resObj = { status: 'success' }
    const collectionName =
      Model.collection.collectionName
    const responceDocumentName = collectionName.replace(
      /s{1}$/,
      ''
    )
    resObj[responceDocumentName] = document

    res.status(200).json(resObj)
  })
}

export const deleteOne = (Model) => {
  return catchPromises(async (req, res, next) => {
    const deletedDocument = await Model.findByIdAndDelete(
      req.params.id
    )

    if (!deletedDocument)
      return next(
        new AppError(
          'No document found with that ID',
          404
        )
      )

    res.status(204).json({ status: 'success' })
  })
}
