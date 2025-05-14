import axiosAPI from "../axiosApi";

export async function getAllRoomCategorys(params = {}) {
  const response = await axiosAPI.get("room-categories", { params: params });
  return response;
}

export async function getRoomCategorysById(id: any) {
  const response = await axiosAPI.get(`room-categories/` + id);
  return response;
}

export async function postRoomCategorys(data: any) {
  const response = await axiosAPI.post(`room-categories`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function updateRoomCategorys(id: any, data: any) {
  const response = await axiosAPI.post(`room-categories/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function deleteRoomCategoryById(id: any) {
  const response = await axiosAPI.delete(`room-categories/${id}`);
  return response;
}

export async function postToBulkDestroyRoomCategorys(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-room-categories`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
