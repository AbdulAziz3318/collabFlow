import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";

import {
  FaSearch,
  FaBell,
  FaMoon,
  FaSun,
  FaUserCircle,
  FaCheckCircle,
  FaTasks,
  FaUsers,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("collabflow-theme") === "dark";
  });

  const notificationRef = useRef(null);

  // Temporary notifications.
  // Later these can come from MongoDB/backend.
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "task",
      title: "New task assigned",
      message: "A new task has been assigned to you.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      type: "project",
      title: "Project updated",
      message: "A project you are part of was updated.",
      time: "10 min ago",
      read: false,
    },
    {
      id: 3,
      type: "team",
      title: "Team update",
      message: "A new member joined your project.",
      time: "1 hour ago",
      read: true,
    },
  ]);

  const unreadCount =
    notifications.filter(
      (notification) => !notification.read
    ).length;

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );

    localStorage.setItem(
      "collabflow-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  const toggleNotifications = () => {
    setShowNotifications((previous) => !previous);
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const handleNotificationClick = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const getNotificationIcon = (type) => {
    if (type === "task") {
      return <FaTasks />;
    }

    if (type === "team") {
      return <FaUsers />;
    }

    return <FaCheckCircle />;
  };

  return (
    <header className="navbar">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search projects..."
        />

        <span className="search-shortcut">
          ⌘ K
        </span>
      </div>

      <div className="right-section">

        {/* NOTIFICATIONS */}

        <div
          className="notification-wrapper"
          ref={notificationRef}
        >
          <button
            type="button"
            className="navbar-icon-button"
            onClick={toggleNotifications}
            title="Notifications"
          >
            <FaBell />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">

              <div className="notification-header">
                <div>
                  <h3>Notifications</h3>

                  <p>
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount !== 1 ? "s" : ""
                        }`
                      : "You're all caught up"}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notification-list">

                {notifications.length > 0 ? (
                  notifications.map(
                    (notification) => (
                      <button
                        type="button"
                        key={notification.id}
                        className={`notification-item ${
                          !notification.read
                            ? "unread"
                            : ""
                        }`}
                        onClick={() =>
                          handleNotificationClick(
                            notification.id
                          )
                        }
                      >
                        <div className="notification-type-icon">
                          {getNotificationIcon(
                            notification.type
                          )}
                        </div>

                        <div className="notification-content">
                          <strong>
                            {notification.title}
                          </strong>

                          <p>
                            {notification.message}
                          </p>

                          <span>
                            {notification.time}
                          </span>
                        </div>

                        {!notification.read && (
                          <span className="unread-dot" />
                        )}
                      </button>
                    )
                  )
                ) : (
                  <div className="notification-empty">
                    <FaBell />

                    <strong>
                      No notifications
                    </strong>

                    <span>
                      New updates will appear here.
                    </span>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* DARK MODE */}

        <button
          type="button"
          className="navbar-icon-button"
          onClick={toggleTheme}
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {darkMode ? (
            <FaSun />
          ) : (
            <FaMoon />
          )}
        </button>

        <div className="navbar-divider" />

        {/* PROFILE */}

        <button
          type="button"
          className="profile-button"
          onClick={() =>
            navigate("/profile")
          }
          title="My Profile"
        >
          <FaUserCircle />

          <span className="profile-status-dot" />
        </button>

      </div>

    </header>
  );
};

export default Navbar;