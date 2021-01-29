// import Authorization from "../services/accessManagement/authorization.service";
import fs from "fs";
import { createLogger, format, transports, LoggerOptions } from "winston";
import { Request, Response } from "express";
import safeJsonStringify from "safe-json-stringify";

// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6
// };

const logingPath = "/ext/logs/meta"

//////////////////////////////Normal Logger////////////////////////////////
const timezoned = () => {
	return new Date().toLocaleString("en-GB", {
		timeZone: "Europe/Brussels",
		hour12: false
	});
};
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getFormatter() {
	const { combine, timestamp, printf, colorize, json } = format;

	return combine(
		colorize(),
		json(),
		timestamp({
			format: timezoned
		}),
		printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
	);
}

let loggerTransports;

if (process.env.NODE_ENV === "production") {
	if (!fs.existsSync(logingPath)) {
		fs.mkdirSync(logingPath, { recursive: true });
	}
	loggerTransports = [
		new transports.Console({
			level: "info"
		}),
		new transports.File({
			filename: logingPath + "/metaErrors.log",
			level: "error"
		}),
		new transports.File({
			filename: logingPath + "/metaLogs.log",
			level: "debug"
		})
	];
} else {
	// Specifying the info level includes all levels that are more severe.
	// If you want' to log more, set the level of logging to "debug", in development.
	loggerTransports = [
		new transports.Console({
			level: "debug"
		})
	];
}

const options: LoggerOptions = {
	transports: loggerTransports,
	format: getFormatter()
};
const logger = createLogger(options);

if (process.env.NODE_ENV !== "production") {
	logger.debug("Logging initialized at debug level");
}

export default logger;
///////////////////////////////////////////////////////////////////////////

//////////////////////////////Service Requests Loggers////////////////////////////////
let requestTransports;

if (process.env.NODE_ENV === "production") {
	if (!fs.existsSync(logingPath)) {
		fs.mkdirSync(logingPath, { recursive: true });
	}
	requestTransports = [
		new transports.Console({
			level: "error"
		}),
		new transports.File({
			filename: logingPath + "/metaRequestErrors.log",
			level: "error"
		}),
		new transports.File({
			filename: logingPath + "/metaLogs.log",
			level: "debug"
		})
	];
} else {
	requestTransports = [
		new transports.Console({
			level: "info"
		})
	];
}

function getRequestLogFormatter() {
	const {
		combine,
		timestamp,
		printf,
		colorize,
		json,
		prettyPrint,
		splat,
		simple
	} = format;

	return combine(
		colorize(),
		json(),
		timestamp({
			format: timezoned
		}),
		prettyPrint(),
		splat(),
		simple(),
		printf((info: any) => {
			const { req, res } = info.message;

			return `${info.timestamp} ${info.level}: ${req.hostname}${req.port || ""} ${
				(req as Request).method
			} ${req.originalUrl} PrincipalId: ${
				req.headers["userId"] ? req.headers["userId"] : ""
			} 
			Body Lenght: ${req.body ? Object.keys(req.body).length : 0}`;
		})
	);
}

function getRequestErrorFormatter() {
	const { combine, timestamp, printf, colorize, json } = format;

	return combine(
		colorize(),
		json(),
		timestamp({
			format: timezoned
		}),
		printf((info: any) => {
			const { req, res } = info.message;
			const returnedMessage = `${info.timestamp} ${info.level}: ${req.hostname}${
				req.port || ""
			} ${(req as Request).method}  ${req.originalUrl} PrincipalId: ${
				req.headers["userId"] ? req.headers["userId"] : ""
			} 
			Body Lenght: ${req.body ? Object.keys(req.body).length : 0}`;

			return returnedMessage;
		})
	);
}

function createRequestLogger() {
	const requestLogger = createLogger({
		format: getRequestLogFormatter(),
		transports: requestTransports
	});

	return function logRequest(req, res, next): void {
		requestLogger.info({ req, res });
		next();
	};
}

function createRequestErrorLogger() {
	const errLogger = createLogger({
		level: "error",
		transports: requestTransports,
		format: getRequestErrorFormatter()
	});

	return function logError(err, req, res, next): void {
		errLogger.error({ err, req, res });
		next();
	};
}
export const requestLogger = createRequestLogger();
export const errorLogger = createRequestErrorLogger();
