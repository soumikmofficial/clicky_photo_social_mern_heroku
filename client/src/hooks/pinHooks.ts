import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ICategory, IError, IPin, IQueryObj } from "../types/api";
import { createPinFetchUrl } from "../utils/buildFetchUrl";

interface ISaveData {
  userId: string;
  pinId: string;
}

interface IPinData {
  title?: string;
  about: string;
  image: File;
}

interface ICreatePinResponse {
  status: string;
  pin: IPin;
}

// todo: functions

const fetchPins = async (queryObj: IQueryObj | undefined): Promise<IPin[]> => {
  const res = await axios.get(createPinFetchUrl(queryObj ? queryObj : {}));
  return res.data;
};

const fetchSinglePin = async (pinId: string | undefined): Promise<IPin> => {
  const res = await axios.get(`/api/v1/pin/${pinId}`);
  return res.data;
};

const fetchPinsSavedByUser = async (
  userId: string | undefined
): Promise<IPin[]> => {
  const res = await axios.get(`/api/v1/pin/saved-by/${userId}`);
  return res.data;
};

const fetchPinsCreatedByUser = async (
  userId: string | undefined
): Promise<IPin[]> => {
  const res = await axios.get(`/api/v1/pin/created-by/${userId}`);
  return res.data;
};

const saveUnsave = async (data: ISaveData): Promise<IPin> => {
  const res = await axios.post(`/api/v1/pin/save`, data);
  return res.data;
};

const fetchAllCategories = async (): Promise<ICategory[]> => {
  const res = await axios.get(`/api/v1/pin/categories`);
  return res.data;
};

const createPin = async (data: IPinData): Promise<ICreatePinResponse> => {
  const res = await axios.post(`/api/v1/pin`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const deletePin = async (pinId: string | undefined): Promise<IPin> => {
  const res = await axios.delete(`/api/v1/pin/${pinId}`);
  return res.data;
};

// todo: custom query hooks

export const usePinsQuery = (queryObj: IQueryObj | undefined) => {
  return useQuery<IPin[], IError>(
    ["fetch-pins", queryObj],
    (context) => fetchPins(queryObj),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
};

export const useSavedPinsQuery = (userId: string | undefined) => {
  return useQuery<IPin[], IError>(
    ["fetch-pins-saved-by-user", userId],
    (context) => fetchPinsSavedByUser(userId),
    {
      refetchOnWindowFocus: false,
      enabled: !!userId,
    }
  );
};

export const useCreatedPinsQuery = (userId: string | undefined) => {
  return useQuery<IPin[], IError>(
    ["fetch-pins-created-by-user", userId],
    (context) => fetchPinsCreatedByUser(userId),
    {
      refetchOnWindowFocus: false,
      enabled: !!userId,
    }
  );
};

export const useSimilarPinsQuery = (category: IQueryObj | undefined) => {
  return useQuery<IPin[], IError>(
    ["fetch-pins-by-category", category],
    (context) => fetchPins(category),
    {
      refetchOnWindowFocus: false,
      enabled: !!category,
    }
  );
};

export const useFetchSinglePinQuery = (pinId: string | undefined) => {
  return useQuery<IPin, IError>(
    ["fetch-single-pin", pinId],
    (context) => fetchSinglePin(pinId),
    {
      refetchOnWindowFocus: false,
      enabled: !!pinId,
    }
  );
};

export const useCategoriesQuery = () => {
  return useQuery<ICategory[], IError>(
    "fetch-all-categories",
    fetchAllCategories,
    {
      refetchOnWindowFocus: false,
    }
  );
};

// todo: custom mutation hooks
export const useSaveMutation = () => {
  return useMutation<IPin, IError, ISaveData>(saveUnsave);
};

export const useCreatePinMutation = () => {
  return useMutation<ICreatePinResponse, IError, IPinData>(createPin);
};

export const useDeletePinMutation = () => {
  const navigate = useNavigate();
  const { pinId } = useParams();
  return useMutation<IPin, IError, string>(deletePin, {
    onSuccess: () => {
      !pinId ? window.location.reload() : navigate("/");
    },
  });
};
