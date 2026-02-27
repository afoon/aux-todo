import { createContext, useContext } from "react"
import type { Socket } from "socket.io-client";
import type { User } from '../types';

export const SocketContext = createContext<{ isConnected: boolean, message: string[], socket: Socket | null }>({
    socket: null,
    isConnected: false,
    message: [],
});

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('react context must be used within a provider');
    }
    return context;
}

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: (username: string) => Promise<void>;
    logout: () => Promise<void>;
  };
  
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
  };