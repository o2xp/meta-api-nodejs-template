import dotenv from "dotenv";
import fs from "fs";


if (fs.existsSync(".env")) {
	// logger.debug("Using .env file to supply config environment variables");
	dotenv.config({ path: ".env" });
} else {
	// logger.debug("Using environment variables to supply config");
}
export const META_PORT = process.env.META_PORT || 5000;
export const ENVIRONMENT = process.env.NODE_ENV;
export const isPRODEnv = ENVIRONMENT === "production"; 

// export certificate information;
export const CRT_PRIVATE_SRV_KEY = isPRODEnv
	? fs.readFileSync("/xx/xx/xx.pem", "utf8")
	: null;
export const CERTIFICATE_SRV = isPRODEnv
	? fs.readFileSync("/xx/xx/xx.crt", "utf8")
    : null;
