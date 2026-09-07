import "./WelcomeBanner.css";

const WelcomeBanner = () => {
  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user")
    );
  } catch {
    user = null;
  }

  const firstName =
    user?.full_name
      ?.split(" ")[0] ||
    "there";

  return (
    <div className="welcome-banner">
      <div>
        <span className="welcome-badge">
          COLLABFLOW AI WORKSPACE
        </span>

        <h1>
          Welcome back, {firstName}
        </h1>

        <p>
          Manage projects, monitor
          workload, assign tasks and
          collaborate from one intelligent
          workspace.
        </p>
      </div>

      <div className="welcome-ai-box">
        <span>AI Workspace</span>

        <strong>
          Smart assignment enabled
        </strong>

        <p>
          Tasks can be matched with team
          members based on skills,
          specialization and workload.
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner;