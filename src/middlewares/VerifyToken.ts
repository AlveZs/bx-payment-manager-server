import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

function verifyToken(request: Request, response: Response, next: NextFunction) {
  const authHeader = <string>request.headers.authorization || <string>request.headers.Authorization;
  const cookies = request.cookies;
  let token = ''

  if (authHeader?.includes('Bearer')) {
    token = <string>authHeader.split(' ')[1];
  } else if (cookies?.accessToken) {
    token = cookies.accessToken;
  }

  if (!token) {
    return response.status(401).json({ message: "UNAUTHORIZED" });
  }

  verify(
    token,
    <string>process.env.ACCESS_TOKEN_KEY,
    (err, decoded) => {
      if (err) {
        return response.status(401).json({ message: "INVALID TOKEN" });
      }
      response.locals.jwtPayload = decoded;
      next();
    }
  );
}


export { verifyToken };