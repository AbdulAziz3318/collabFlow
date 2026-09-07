import "./WelcomeBanner.css";

const WelcomeBanner = () => {
  return (
    <div className="welcome-banner">
      <div className="banner-content">
        <h1>Welcome Back 👋</h1>

        <p>
          Manage your projects, track progress, collaborate with your team,
          and boost productivity—all in one place.
        </p>

        <button className="create-btn">
          + Create Project
        </button>
      </div>

      <div className="banner-image">
        <img
          src="https://undraw.co/api/illustrations/remote-team.svg"
          alt="Team"
        />
      </div>
    </div>
  );
};

export default WelcomeBanner;