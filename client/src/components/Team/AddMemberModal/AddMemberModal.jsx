import {
  useEffect,
  useState,
} from "react";

import "./AddMemberModal.css";

import {
  searchUsers,
} from "../../../services/userService";

const AddMemberModal = ({
  isOpen,
  onClose,
  onSelectMember,
  existingMembers = [],
}) => {
  const [search, setSearch] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setUsers([]);
      setError("");
      return;
    }

    let cancelled = false;

    const timer = setTimeout(
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await searchUsers(
              search.trim()
            );

          if (cancelled) {
            return;
          }

          const existingIds =
            existingMembers.map(
              (member) =>
                String(
                  member?.id ||
                    member?._id ||
                    member
                )
            );

          const availableUsers =
            (
              Array.isArray(
                response.data
              )
                ? response.data
                : []
            ).filter((user) => {
              const userId =
                String(
                  user.id ||
                    user._id
                );

              return (
                !existingIds.includes(
                  userId
                )
              );
            });

          setUsers(
            availableUsers
          );
        } catch (err) {
          if (!cancelled) {
            console.error(
              "Search users failed:",
              err
            );

            setError(
              "Unable to load registered users."
            );

            setUsers([]);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      },
      350
    );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSelect = (
    user
  ) => {
    if (
      typeof onSelectMember ===
      "function"
    ) {
      onSelectMember(user);
    }
  };

  return (
    <div
      className="add-member-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="add-member-modal">
        <div className="add-member-header">
          <div>
            <span>
              REGISTERED USERS
            </span>

            <h2>
              Add Member
            </h2>

            <p>
              Search users who
              already have a
              CollabFlow account.
            </p>
          </div>

          <button
            type="button"
            className="add-member-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="member-search-box">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by name or email..."
            autoFocus
          />
        </div>

        <div className="member-search-results">
          {loading ? (
            <div className="member-search-message">
              Loading registered
              users...
            </div>
          ) : error ? (
            <div className="member-search-message">
              {error}
            </div>
          ) : users.length ===
            0 ? (
            <div className="member-search-message">
              No registered users
              found.
            </div>
          ) : (
            users.map((user) => {
              const userId =
                user.id ||
                user._id;

              const skills =
                Array.isArray(
                  user.skills
                )
                  ? user.skills
                  : [];

              return (
                <div
                  className="member-search-card"
                  key={userId}
                >
                  <div className="member-search-avatar">
                    {(
                      user.full_name ||
                      user.name ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="member-search-info">
                    <strong>
                      {user.full_name ||
                        user.name}
                    </strong>

                    <span>
                      {user.email}
                    </span>

                    <small>
                      {user.specialization ||
                        user.role ||
                        "Member"}
                    </small>

                    {skills.length >
                      0 && (
                      <div className="member-search-skills">
                        {skills
                          .slice(
                            0,
                            3
                          )
                          .map(
                            (
                              skill
                            ) => (
                              <span
                                key={
                                  skill
                                }
                              >
                                {
                                  skill
                                }
                              </span>
                            )
                          )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleSelect(
                        user
                      )
                    }
                  >
                    Add
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;