import dotenv from "dotenv";
import https from "https";
import http from "http";
import { Application } from "express";
import app from "./App";

dotenv.config();

let server: https.Server | http.Server | Application;

const isPRODEnv = false;
const META_PORT = 5000;

if (isPRODEnv) {
	const credentials = { key: "CRT_PRIVATE_SRV_KEY", cert: "CERTIFICATE_SRV" };
	server = https.createServer(credentials, app);
} else {
	server = http.createServer(app);
}


server.listen(META_PORT, () => {
	console.debug("Express server listening on port " + META_PORT);
	console.info("META is UP");
	if (isPRODEnv) {
		console.info("SSL is active");
	} else {
		console.info("SSL not active");
	}
});
