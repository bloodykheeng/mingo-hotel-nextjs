import axiosAPI from "../axiosApi";

export async function getAllRoomBookings(params = {}) {
  const response = await axiosAPI.get("room-bookings", { params: params });
  return response;
}

export async function getRoomBookingsById(id: any) {
  const response = await axiosAPI.get(`room-bookings/` + id);
  return response;
}

export async function postRoomBookings(data: any) {
  const response = await axiosAPI.post(`room-bookings`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function updateRoomBookings(id: any, data: any) {
  const response = await axiosAPI.post(`room-bookings/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function deleteRoomBookingById(id: any) {
  const response = await axiosAPI.delete(`room-bookings/${id}`);
  return response;
}

export async function postToBulkDestroyRoomBookings(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-room-bookings`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
