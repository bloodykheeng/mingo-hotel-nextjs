import axiosAPI from "../axiosApi";

export async function getAllContactUs(params = {}) {
  const response = await axiosAPI.get("contact-us", { params: params });
  return response;
}

export async function getContactUsById(id: any) {
  const response = await axiosAPI.get(`contact-us/` + id);
  return response;
}

export async function postContactUs(data: any) {
  const response = await axiosAPI.post(`contact-us`, data);
  return response;
}

export async function updateContactUs(id: any, data: any) {
  const response = await axiosAPI.put(`contact-us/${id}`, data);
  return response;
}

export async function deleteContactUsById(id: any) {
  const response = await axiosAPI.delete(`contact-us/${id}`);
  return response;
}

export async function postToBulkDestroyContactUs(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-contact-us`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
