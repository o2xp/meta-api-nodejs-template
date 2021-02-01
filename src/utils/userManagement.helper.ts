// This middleware attemps the extraction of the userid from the request headers

import { Request, Response, NextFunction } from "express";
import jwtDecode from "jwt-decode";
import { isPRODEnv } from "./secrets.helper";

function getCookie(name: string, cookie): string {
  const value = "; " + cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
}

export function clientUserid(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    if (req.headers) {
      let jwt;
      if (req.headers.cookie) {
        jwt = getCookie("am-auth-jwt", req.headers.cookie);
      }
      if (jwt) {
        // Can be replaced by another decoder.
        const decodedJwt = jwtDecode(jwt);
        req.headers["userId"] = (decodedJwt as any).sub;
      } else {
        if (isPRODEnv) {
          req.headers["userId"] = "DEFAULT_USER";
        } else {
          req.headers["userId"] = "SUPER_USER";
        }
      }
    }
  } catch (e) {
    //just move on
  } finally {
    next();
  }
}
