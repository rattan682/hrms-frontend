import axios from "axios";
import { BACKEND_API } from "../../constants";
import axiosClient from "./axiosClient";

export const apiClient = async ({ url, method, data }) => {
  let fullUrl = url;

  switch (method?.toLowerCase()) {
    case "get":
      return await axiosClient.get(fullUrl);
    case "post":
      return await axiosClient.post(fullUrl, data);
    case "patch":
      return await axiosClient.patch(fullUrl, data);
    case "put":
      return await axiosClient.put(fullUrl, data);
    case "delete":
      return await axiosClient.delete(fullUrl);
    default:
      throw new Error("Unsupported HTTP method");
  }
};
