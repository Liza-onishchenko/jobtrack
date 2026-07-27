import { useAppSelector } from '../app/hooks';

export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Welcome back{user ? `, ${user.name}` : ''}.</p>
    </div>
  );
}
