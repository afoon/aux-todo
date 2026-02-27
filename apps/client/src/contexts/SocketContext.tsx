import { SocketContext } from "./index";
import { useEffect, useState } from "react";
import { socket } from "../socket";

export const IoProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [message, setMessage] = useState(['']);
  
    useEffect(() => {
      function onConnect() {
        setIsConnected(true);
      }
  
      function onDisconnect() {
        setIsConnected(false);
      }
  
      function onMessageEvent(value: string) {
        setMessage(previous => [...previous, value]);
      }
  
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('message', onMessageEvent);
  
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('message', onMessageEvent);
      };
    }, []);
    const value = { isConnected, message, socket };
  
    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}
