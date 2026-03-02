import { useState} from 'react'
import { useAuth } from '../../contexts/index';
import './signup-styles.css';

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
      <div className="signin">
      <form onSubmit={onSubmit} className="signin form">
        <div className="signin-header">
        <h1>Welcome to the Todo App</h1>
        <h2>Please enter your username to continue</h2>
        </div>
        <div className="signin-content">
<div className="signin-content-input">
        <label htmlFor="username">Username</label>
        <input
          placeholder="Enter username"
          className="edit-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          />
          </div>
        <button type="submit" disabled={isLoading} className=" button">
          {isLoading ? '...' : 'Continue'}
        </button>
          </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      </div>
    );
  }