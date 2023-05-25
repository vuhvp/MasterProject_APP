import { HOST_URL } from "@env";
import React from "react";
import io from "socket.io-client";

export const socket = io(HOST_URL, {
    transports: ["websocket"],
});
export const SocketContext = React.createContext();
