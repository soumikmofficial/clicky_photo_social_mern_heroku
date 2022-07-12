import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface IGoogleUser {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface IUser {
  name: string;
  email: string;
  avatar: string;
  googleId: string;
}
