import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";


function verifyToken(request: Request, response: Response, next: NextFunction) {
  let token = <string>request.headers["authorization"];

  if (token && token.includes("Bearer")) {
    token = token.split("Bearer ")[1];
  }

  if (!token) {
    return response.status(403).json({ message: "A token is required for authentication" }).send();
  }

  try {
    const decoded = <any>verify(token, <string>process.env.TOKEN_KEY);
    response.locals.jwtPayload = decoded;

    const { userId, userUuid } = decoded;

    const newToken = sign({ userId, userUuid }, <string>process.env.TOKEN_KEY, {
      expiresIn: "1h"
    });
  
    response.setHeader("token", newToken);
  } catch (err) {
    return response.status(401).json({ message: "Invalid Token" }).send();
  }

  return next();
}


export { verifyToken };