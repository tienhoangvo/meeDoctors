import catchPromises from './../utils/catchPromises'
import AppError from '../utils/appError'

export const listAll = (Model) => {
  return catchPromises(async (req, res, next) => {
    const documents = await Model.find()
    const resObj = { status: 'success' }
    resObj[Model.collection.collectionName] = documents
    setTimeout(() => {
      console.log('from get all', resObj)
      res.status(200).json(resObj)
    }, 3000)
  })
}

export const getOne = (Model) => {
  return catchPromises(async (req, res, next) => {
    const document = await Model.findById(
      req.params.id
    )
    const resObj = { status: 'success' }
    const collectionName =
      Model.collection.collectionName
    const responceDocumentName = collectionName.replace(
      /s{1}$/,
      ''
    )
    resObj[responceDocumentName] = document
    console.log(resObj)
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

    console.log(resObj)
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

    console.log(resObj)
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
