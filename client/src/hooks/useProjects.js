import { useState } from "react";
import { getProjects } from "../services/projectService";

const useProjects = () => {
  const [projects] = useState(getProjects());

  return { projects };
};

export default useProjects;