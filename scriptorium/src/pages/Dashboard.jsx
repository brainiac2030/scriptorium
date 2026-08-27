import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-burgundy-800 mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600">Your personal reading library</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-8 border border-burgundy-100">
        <h2 className="font-serif text-2xl font-bold text-burgundy-700 mb-4">
          Your Collections
        </h2>
        <p className="text-gray-600">
          
        </p>
      </div>
    </div>
  );
}

export default Dashboard;