import "./Home.css";

import WelcomeBanner from "../../components/Dashboard/WelcomeBanner/WelcomeBanner";
import StatsCards from "../../components/Dashboard/StatsCards/StatsCards";
import RecentProjects from "../../components/Dashboard/RecentProjects/RecentProjects";
import RecentTasks from "../../components/Dashboard/RecentTasks/RecentTasks";

const Home = () => {
  return (
    <div className="home-page">

      <WelcomeBanner />

      <StatsCards />

      <RecentProjects />

      <RecentTasks />

    </div>
  );
};

export default Home;