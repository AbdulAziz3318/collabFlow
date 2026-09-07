import API from "../api/axios";

export const getTeam = () => {
  return API.get("/team");
};

export const uploadResume = (
  userId,
  file
) => {
  const formData =
    new FormData();

  formData.append(
    "resume",
    file
  );

  return API.post(
    `/team/resume/${userId}`,
    formData
  );
};

export const suggestMembers = (
  data
) => {
  return API.post(
    "/team/suggest",
    data
  );
};