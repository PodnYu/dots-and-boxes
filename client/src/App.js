import React from "react";
// import { Route } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./components/Auth/Auth";

import io from "socket.io-client";

import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./components/Home/Home";
import Lobby from "./components/Lobby/Lobby";

export const PlayerContext = React.createContext();

const socket = io("http://localhost:5005");

export default function App() {
	const [nickname, setNickname] = React.useState("");

	return (
		<PlayerContext.Provider
			value={{
				socket,
				nickname,
				updateNickname: setNickname,
			}}>
			<Router>
				<ProtectedRoute exact path="/" component={Home} auth={nickname != ""} />
				<ProtectedRoute exact path="/lobby" component={Lobby} auth={nickname != ""} />
				<Route exact path="/login" component={Auth} />
			</Router>
		</PlayerContext.Provider>
	);
}
