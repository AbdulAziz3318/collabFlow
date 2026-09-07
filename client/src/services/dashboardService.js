import API from "../api/axios";

export const getDashboardStats = async () => {
  return await API.get("/dashboard/stats");
};

export const getRecentProjects = async () => {
  return await API.get("/projects");
};

export const getRecentTasks = async () => {
  return await API.get("/tasks");
};