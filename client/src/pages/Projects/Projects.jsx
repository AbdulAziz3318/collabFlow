import {
  useEffect,
  useState,
} from "react";
import "./Projects.css";
import {
  useNavigate,
} from "react-router-dom";

import ProjectHeader from "../../components/Projects/ProjectHeader/ProjectHeader";
import ProjectSearch from "../../components/Projects/ProjectSearch/ProjectSearch";
import ProjectGrid from "../../components/Projects/ProjectGrid/ProjectGrid";
import AddProjectModal from "../../components/Projects/AddProjectModal/AddProjectModal";

import {
  getProjects,
  addProject,
  deleteProject,
} from "../../services/projectService";

const Projects = () => {
  const navigate =
    useNavigate();

  const [
    projects,
    setProjects,
  ] = useState([]);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState("All");

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const loadProjects =
    async () => {
      try {
        const response =
          await getProjects();

        setProjects(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Error loading projects:",
          error
        );
      }
    };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAddProject =
    async (projectData) => {
      try {
        const response =
          await addProject(
            projectData
          );

        setIsModalOpen(false);

        await loadProjects();

        const createdProject =
          response.data?.project ||
          response.data;

        const projectId =
          createdProject?.id ||
          createdProject?._id;

        if (projectId) {
          navigate(
            `/projects/${projectId}`
          );
        }
      } catch (error) {
        console.error(
          "Project creation failed:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to create project"
        );
      }
    };

  const handleDeleteProject =
    async (id) => {
      try {
        await deleteProject(
          id
        );

        await loadProjects();
      } catch (error) {
        console.error(
          "Project delete failed:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to delete project"
        );
      }
    };

  const handleOpenProject = (
    id
  ) => {
    navigate(
      `/projects/${id}`
    );
  };

  const filteredProjects =
    projects.filter(
      (project) => {
        const matchesSearch =
          (
            project.title ||
            ""
          )
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesFilter =
          filter === "All" ||
          project.status ===
            filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  return (
    <div className="projects-page">
      <ProjectHeader
        onAdd={() =>
          setIsModalOpen(true)
        }
      />

      <ProjectSearch
        searchTerm={
          searchTerm
        }
        setSearchTerm={
          setSearchTerm
        }
        filter={filter}
        setFilter={
          setFilter
        }
      />

      <ProjectGrid
        projects={
          filteredProjects
        }
        onDelete={
          handleDeleteProject
        }
        onOpen={
          handleOpenProject
        }
      />

      <AddProjectModal
        isOpen={
          isModalOpen
        }
        onClose={() =>
          setIsModalOpen(
            false
          )
        }
        onAddProject={
          handleAddProject
        }
      />
    </div>
  );
};

export default Projects;