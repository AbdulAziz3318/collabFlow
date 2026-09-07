import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import "./Sidebar.css";

import {
  FaHome,
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaRobot,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";


const menuItems = [
  {
    icon: <FaHome />,
    label: "Dashboard",
    path: "/",
  },

  {
    icon: <FaProjectDiagram />,
    label: "Projects",
    path: "/projects",
  },

  {
    icon: <FaTasks />,
    label: "Tasks",
    path: "/tasks",
  },

  {
    icon: <FaUsers />,
    label: "Team",
    path: "/team",
  },

  {
    icon: <FaRobot />,
    label: "AI Assistant",
    path: "/ai",
  },

  {
    icon: <FaCog />,
    label: "Settings",
    path: "/settings",
  },
];


const Sidebar = () => {
  const navigate =
    useNavigate();


  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/login"
    );
  };


  return (
    <aside className="sidebar">

      {/* ====================================== */}
      {/* LOGO */}
      {/* ====================================== */}

      <div className="logo">
        <h2>
          CollabFlow
        </h2>

        <span>
          AI Workspace
        </span>
      </div>


      {/* ====================================== */}
      {/* MENU */}
      {/* ====================================== */}

      <nav className="menu">

        {menuItems.map(
          (item) => (
            <NavLink
              key={
                item.label
              }

              to={
                item.path
              }

              end={
                item.path ===
                "/"
              }

              className={({
                isActive,
              }) =>
                isActive
                  ? "menu-item active"
                  : "menu-item"
              }
            >

              <div className="menu-icon">
                {item.icon}
              </div>

              <span>
                {item.label}
              </span>

            </NavLink>
          )
        )}

      </nav>


      {/* ====================================== */}
      {/* LOGOUT */}
      {/* ====================================== */}

      <button
        type="button"
        className="logout-btn"
        onClick={
          handleLogout
        }
      >

        <FaSignOutAlt />

        <span>
          Logout
        </span>

      </button>

    </aside>
  );
};


export default Sidebar;