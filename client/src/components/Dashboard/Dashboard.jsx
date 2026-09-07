import "./Dashboard.css";

const Dashboard = ({ children }) => {
  return (
    <main className="dashboard">
      {children}
    </main>
  );
};

export default Dashboard;