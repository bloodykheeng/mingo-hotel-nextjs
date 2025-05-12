import axiosAPI from "../axiosApi";

export async function getAllRooms(params = {}) {
  const response = await axiosAPI.get("rooms", { params: params });
  return response;
}

export async function getRoomsById(id: any) {
  const response = await axiosAPI.get(`rooms/` + id);
  return response;
}

export async function postRooms(data: any) {
  const response = await axiosAPI.post(`rooms`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function updateRooms(id: any, data: any) {
  const response = await axiosAPI.post(`rooms/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function deleteRoomById(id: any) {
  const response = await axiosAPI.delete(`rooms/${id}`);
  return response;
}

export async function postToBulkDestroyRooms(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-rooms`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
