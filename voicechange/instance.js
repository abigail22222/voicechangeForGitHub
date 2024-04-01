let instance = axios.create();

instance.defaults.baseURL = "http://localhost:5000";
instance.defaults.headers["Content-Type"] = "multipart/form-data";
instance.defaults.transformRequest = (data, headers) => {
  const contentType = headers["Content-Type"];
  if (contentType === "application/x-www-form-urlencode")
    return Qs.stringify(data);
  return data;
};
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (reason) => {
    //...error的提示
    return Promise.reject(reason);
  }
);
