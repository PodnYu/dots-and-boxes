import React from "react";

import "./Home.css";

import PlayerList from "./PlayerList/PlayerList.js";
import LobbyList from "./LobbyList/LobbyList";

export default function Home() {
	return (
		<div id="home">
			<header id="page-header">Header</header>
			<PlayerList />
			<LobbyList />
		</div>
	);
}
