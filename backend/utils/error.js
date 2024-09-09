const errorHandler = (err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });
    res.status(err.status || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
    });
}

module.exports = { errorHandler };