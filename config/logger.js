// sets up a logger using Winston, a versatile logging library for Node.js.
// The logger is configured with a custom format and a transport mechanism to output logs.
const winston = require('winston');

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack })
    }
    return info
})

// Configures logging to the console. It also specifies that stderrLevels include 'error', meaning error logs will be written to stderr while other logs will go to stdout.
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        enumerateErrorFormat(),
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`)
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error']
        }),
    ],
})

module.exports = logger


// Morgan: Morgan is specifically designed for logging HTTP requests in Node.js applications. It is typically used as middleware in Express.js applications to automatically log details about each incoming HTTP request, such as the method, URL, status code, and response time.
// Winston: Winston is a more general-purpose logging library that can handle various types of logging needs. It's used for creating custom loggers and logging messages throughout an application, not just for HTTP requests. You can log any information, including errors, debug messages, and general information.

//Object.assign
// const obj = { a: 1 };
// Object.assign(obj, { b: 2, c: 3 });
// // obj: { a: 1, b: 2, c: 3 }

// It copies enumerable and own properties from a source object to a target object.
// It invokes getters and setters since it uses both [[Get]] on the source and [[Set]] on the target.