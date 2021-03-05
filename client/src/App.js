import React from "react";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

import io from "socket.io-client";

import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./components/Home/Home";
import Lobby from "./components/Lobby/Lobby.js";

export const SocketContext = React.createContext();

const socket = io("http://localhost:5005");

export default function App() {
	return (
		<SocketContext.Provider value={socket}>
			<BrowserRouter>
				<Route exact path="/" component={Home} />
				<Route exact path="/lobby" component={Lobby} />
			</BrowserRouter>
		</SocketContext.Provider>
	);
}
