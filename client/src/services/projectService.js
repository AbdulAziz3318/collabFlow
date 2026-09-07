import API from "../api/axios";

export const getProjects = () => {
  return API.get("/projects");
};

export const getProject = (id) => {
  return API.get(`/projects/${id}`);
};

export const addProject = (project) => {
  return API.post("/projects", project);
};

export const updateProject = (id, project) => {
  return API.put(`/projects/${id}`, project);
};

export const deleteProject = (id) => {
  return API.delete(`/projects/${id}`);
};

export const addProjectMember = (
  projectId,
  userId
) => {
  return API.post(
    `/projects/${projectId}/members`,
    {
      userId,
    }
  );
};

export const removeProjectMember = (
  projectId,
  userId
) => {
  return API.delete(
    `/projects/${projectId}/members/${userId}`
  );
};