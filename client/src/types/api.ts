export interface IPin {
  __v: number;
  _id: string;
  about: string;
  category: string;
  cloudinaryId: string;
  createdAt: Date;
  downloadUrl: string;
  image: string;
  saves: string[];
  title: string;
  updatedAt: Date;
  userId: IUserID;
}

export interface IUserID {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  googleId: string;
}

export interface IError extends Error {
  response: any;
  statusText?: string;
}

export interface IComment {
  __v: number;
  _id: string;
  comment: string;
  createdAt: Date;
  pinId: string;
  updatedAt: Date;
  userId: IUserID;
}

export interface ICategory {
  _id: string;
  count: number;
}

export interface IQueryObj {
  search?: string;
  category?: string;
}
