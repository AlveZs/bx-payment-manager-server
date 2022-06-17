import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

function verifyToken(request: Request, response: Response, next: NextFunction) {
  const authHeader = <string>request.headers.authorization || <string>request.headers.Authorization;

  if (!authHeader?.includes('Bearer')) {
    return response.sendStatus(401);
  }

  const token = authHeader ? <string>authHeader.split(' ')[1] : '';

  if (!token) {
    return response.status(401).json({ message: "A token is required for authentication" });
  }

  verify(
    token,
    <string>process.env.ACCESS_TOKEN_KEY,
    (err, decoded) => {
      if (err) {
        return response.sendStatus(403);
      }
      response.locals.jwtPayload = decoded;
      next();
    }
  );
}


export { verifyToken };