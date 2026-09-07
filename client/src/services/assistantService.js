import API from "../api/axios";

export const sendAssistantMessage = (
  message
) => {
  return API.post(
    "/assistant/chat",
    {
      message,
    }
  );
};