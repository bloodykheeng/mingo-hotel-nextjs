import axiosAPI from "../axiosApi";

export async function getAllStatisticsCards(params = {}) {
  const response = await axiosAPI.get("getAllStatisticsCards", {
    params: params
  });
  return response;
}

export async function getProjectsWithReports(params = {}) {
  const response = await axiosAPI.get("getProjectsWithReports", {
    params: params
  });
  return response;
}

export async function getProjectsBarChartByFields(params = {}) {
  const response = await axiosAPI.get("getProjectsBarChartByFields", {
    params: params
  });
  return response;
}
