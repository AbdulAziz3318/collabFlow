import API from "../api/axios";

export const getTasks = (
  projectId = null
) => {
  if (projectId) {
    return API.get(
      `/tasks?project=${projectId}`
    );
  }

  return API.get("/tasks");
};

export const addTask = (
  task
) => {
  return API.post(
    "/tasks",
    task
  );
};

export const updateTask = (
  id,
  updates
) => {
  console.log(
    "UPDATING TASK:",
    id
  );

  console.log(
    "UPDATE DATA:",
    updates
  );

  return API.patch(
    `/tasks/${id}`,
    updates
  );
};

export const deleteTask = (
  id
) => {
  return API.delete(
    `/tasks/${id}`
  );
};