
import './App.css'
import { useState } from 'react';
import { IoProvider } from './contexts/SocketContext'
import { useSocket } from './contexts/index';

function App() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSocket();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    socket?.timeout(5000).emit('create-something', value, () => {
      setIsLoading(false);
    });
  }
  return (
<IoProvider>
<form onSubmit={ onSubmit }>
      <input onChange={ e => setValue(e.target.value) } />
      <button type="submit" disabled={ isLoading }>Submit</button>
    </form>
</IoProvider>
  )
}

export default App
