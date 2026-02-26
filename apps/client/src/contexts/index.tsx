import { createContext, useContext } from "react"
import type { Socket } from "socket.io-client";

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