import React from "react";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./components/Home/Home";
import Lobby from "./components/Lobby/Lobby.js";

export default function App() {
	return (
		<BrowserRouter>
			<Route exact path="/" component={Home} />
			<Route exact path="/lobby" component={Lobby} />
		</BrowserRouter>
	);
}
