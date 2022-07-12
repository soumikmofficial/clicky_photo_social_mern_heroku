import { IQueryObj } from "../types/api";

export const createPinFetchUrl = (queryObj: IQueryObj) => {
  const keys = Object.keys(queryObj);
  let url = `/api/v1/pin?`;
  keys.forEach((key) => {
    url = `${url}&${key}=${queryObj[key as keyof IQueryObj]}`;
  });
  return url;
};
