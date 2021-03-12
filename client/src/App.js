import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./components/Auth/Auth";
import Home from "./components/Home/Home";
import Lobby from "./components/Lobby/Lobby";

import io from "socket.io-client";
const socket = io("http://localhost:5005");

export const PlayerContext = React.createContext();

export default function App() {
	const [nickname, setNickname] = React.useState("");

	return (
		<PlayerContext.Provider value={{ socket, nickname, setNickname }}>
			<Router>
				<ProtectedRoute exact path="/" component={Home} auth={nickname != ""} />
				<ProtectedRoute exact path="/lobby/:name" component={Lobby} auth={nickname != ""} />
				<Route exact path="/login" component={Auth} />
			</Router>
		</PlayerContext.Provider>
	);
}
