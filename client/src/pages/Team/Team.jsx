import { useEffect, useState } from "react";
import "./Team.css";

import { FaMagnifyingGlass } from "react-icons/fa6";

import { getTeam } from "../../services/teamService";

import MemberCard from "../../components/Team/MemberCard/MemberCard";

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTeam();

      setTeam(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load team:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load registered users."
      );

      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const filteredTeam = team.filter((member) => {
    const name =
      member.full_name ||
      member.name ||
      "";

    const email =
      member.email || "";

    const specialization =
      member.specialization || "";

    const skills =
      Array.isArray(member.skills)
        ? member.skills
        : [];

    const searchValue =
      search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      name
        .toLowerCase()
        .includes(searchValue) ||
      email
        .toLowerCase()
        .includes(searchValue) ||
      specialization
        .toLowerCase()
        .includes(searchValue) ||
      skills.some((skill) =>
        String(skill)
          .toLowerCase()
          .includes(searchValue)
      );

    const status =
      member.status ||
      (
        Number(member.active_tasks) >= 3
          ? "Busy"
          : "Available"
      );

    const matchesStatus =
      statusFilter === "All" ||
      status === statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  });

  const availableCount =
    team.filter((member) => {
      const status =
        member.status ||
        (
          Number(member.active_tasks) >= 3
            ? "Busy"
            : "Available"
        );

      return status === "Available";
    }).length;

  const busyCount =
    team.filter((member) => {
      const status =
        member.status ||
        (
          Number(member.active_tasks) >= 3
            ? "Busy"
            : "Available"
        );

      return status === "Busy";
    }).length;

  return (
    <div className="team-page">

      {/* PAGE HEADER */}

      <div className="team-header">
        <div>
          <span className="team-eyebrow">
            WORKSPACE
          </span>

          <h1>Team Directory</h1>

          <p>
            View registered CollabFlow users,
            their skills, expertise and current
            workload.
          </p>
        </div>

        <div className="team-member-count">
          <span>Registered Users</span>

          <strong>
            {team.length}
          </strong>
        </div>
      </div>

      {/* SEARCH + FILTER */}

      <div className="team-toolbar">

        <div className="team-search-box">
          <FaMagnifyingGlass />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by name, email, skill or specialization..."
          />
        </div>

        <select
          className="team-status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="All">
            All Users
          </option>

          <option value="Available">
            Available
          </option>

          <option value="Busy">
            Busy
          </option>
        </select>

      </div>

      {/* SUMMARY */}

      <div className="team-summary">

        <div className="team-summary-card">
          <div>
            <span>
              Total Users
            </span>

            <p>
              Registered accounts
            </p>
          </div>

          <strong>
            {team.length}
          </strong>
        </div>

        <div className="team-summary-card">
          <div>
            <span>
              Available
            </span>

            <p>
              Ready for work
            </p>
          </div>

          <strong>
            {availableCount}
          </strong>
        </div>

        <div className="team-summary-card">
          <div>
            <span>
              Busy
            </span>

            <p>
              Higher workload
            </p>
          </div>

          <strong>
            {busyCount}
          </strong>
        </div>

      </div>

      {/* DIRECTORY INFORMATION */}

      <div className="team-directory-info">
        <div>
          <strong>
            Registered User Directory
          </strong>

          <span>
            Members are added to individual
            projects from the Project Details
            page.
          </span>
        </div>

        <span className="team-result-count">
          {filteredTeam.length} result
          {filteredTeam.length !== 1
            ? "s"
            : ""}
        </span>
      </div>

      {/* CONTENT */}

      {loading ? (
        <div className="team-empty">
          Loading registered users...
        </div>
      ) : error ? (
        <div className="team-empty team-error">
          <div>
            <strong>
              Unable to load team
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={loadTeam}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="team-empty">
          <div>
            <strong>
              No users found
            </strong>

            <p>
              Try changing your search
              or availability filter.
            </p>
          </div>
        </div>
      ) : (
        <div className="team-grid">
          {filteredTeam.map((member) => (
            <MemberCard
              key={
                member.id ||
                member._id
              }
              member={member}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Team;