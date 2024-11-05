// logger.js
const { createLogger, format, transports } = require('winston')

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    // Optional: log to a file as well
    new transports.File({ filename: 'app.log' })
  ]
})

module.exports = logger
