import axiosAPI from "../axiosApi";

export async function getAllFeatures(params = {}) {
  const response = await axiosAPI.get("features", { params: params });
  return response;
}

export async function getFeaturesById(id: any) {
  const response = await axiosAPI.get(`features/` + id);
  return response;
}

export async function postFeatures(data: any) {
  const response = await axiosAPI.post(`features`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function updateFeatures(id: any, data: any) {
  const response = await axiosAPI.post(`features/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function deleteFeatureById(id: any) {
  const response = await axiosAPI.delete(`features/${id}`);
  return response;
}

export async function postToBulkDestroyFeatures(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-features`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
