import { useState} from 'react'
import { useAuth } from '../../contexts/index';
export default function SignIn() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
  
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setError('');
      setIsLoading(true);
      try {
        await login(username);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Login failed');
      } finally {
        setIsLoading(false);
      }
    }
  
    return (
      <>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '...' : 'Continue'}
        </button>
        {error && <p>{error}</p>}
      </form>
      </>
    );
  }