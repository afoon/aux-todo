import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IoProvider } from './contexts/SocketContext';
import { useAuth } from './contexts/index';
import { AuthProvider } from './contexts/AuthContext';

import Todo from './components/Todo';
import SignIn from './components/SignIn';
const queryClient = new QueryClient();


function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <SignIn/>;
  return (
    <IoProvider>
      <Todo />
    </IoProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
