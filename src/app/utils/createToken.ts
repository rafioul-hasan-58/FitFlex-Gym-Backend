import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { email: string; role: string,userId:string },
  secret: string,
  expiresIn: number | `${number}${'s' | 'm' | 'h' | 'd'}`
) => {
  const options: SignOptions = { expiresIn }; 
  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
