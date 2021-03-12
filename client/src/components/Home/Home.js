import React, { useEffect, useContext } from "react";
import "./Home.css";

import PlayersList from "./PlayersList/PlayersList";
import LobbiesList from "./LobbiesList/LobbiesList";

import { PlayerContext } from "../../App";

export default function Home() {
	const { socket } = useContext(PlayerContext);

	useEffect(() => {
		socket.emit("enterPlayer");
	}, []);

	return (
		<div id="home-container">
			<header id="page-header">Header</header>
			<PlayersList />
			<LobbiesList />
		</div>
	);
}
