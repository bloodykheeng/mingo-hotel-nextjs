import axiosAPI from "../axiosApi";

export async function getAllHeroSliders(params = {}) {
  const response = await axiosAPI.get("hero-sliders", { params: params });
  return response;
}

export async function getHeroSlidersById(id: any) {
  const response = await axiosAPI.get(`hero-sliders/` + id);
  return response;
}

export async function postHeroSliders(data: any) {
  const response = await axiosAPI.post(`hero-sliders`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function updateHeroSliders(id: any, data: any) {
  const response = await axiosAPI.post(`hero-sliders/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function deleteHeroSliderById(id: any) {
  const response = await axiosAPI.delete(`hero-sliders/${id}`);
  return response;
}

export async function postToBulkDestroyHeroSliders(data: any) {
  const response = await axiosAPI.post(`bulk-destroy-hero-sliders`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
