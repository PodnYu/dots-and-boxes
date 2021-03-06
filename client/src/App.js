import React from "react";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./components/Auth/Auth";

import io from "socket.io-client";

import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./components/Home/Home";
import Lobby from "./components/Lobby/Lobby.js";

export const PlayerContext = React.createContext();

const socket = io("http://localhost:5005");

export default function App() {

	const [nickname, setNickname] = React.useState("keks");

	React.useEffect(() => {
		console.log("nickname: ", nickname);
	}, [nickname]);

	return (
		<PlayerContext.Provider value={{
			socket,
			nickname,
			updateNickname: setNickname
		}}>
			<BrowserRouter>
				<ProtectedRoute exact path="/" component={Home} />
				<ProtectedRoute exact path="/lobby" component={Lobby} />
				<Route exact path="/login" component={Auth} />
			</BrowserRouter>
		</PlayerContext.Provider>
	);
}