const catchPromises = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (err) {
      console.log('from catch async', err)
      next(err)
    }
  }
}

export default catchPromises
