import React from "react";

import "./Home.css";

import PlayersList from "./PlayersList/PlayersList.js";
import LobbiesList from "./LobbiesList/LobbiesList";

export default function Home() {
	return (
		<div id="home-container">
			<header id="page-header">Header</header>
			<PlayersList />
			<LobbiesList />
		</div>
	);
}
