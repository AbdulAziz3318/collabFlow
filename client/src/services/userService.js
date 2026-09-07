import API from "../api/axios";

export const searchUsers = (
  search = ""
) => {
  return API.get(
    "/users/search",
    {
      params: {
        search,
      },
    }
  );
};