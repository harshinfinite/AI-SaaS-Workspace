import WorkspaceSwitcher from '@/components/features/workspace-switcher';
const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard</p>
      <button>sign out</button>
      <WorkspaceSwitcher />
    </div>
  );
};

export default Dashboard;
