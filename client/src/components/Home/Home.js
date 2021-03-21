import { useEffect, useContext } from "react";

import "./css/Home.css";

import PlayersList from "./PlayersList";
import LobbiesList from "./LobbiesList";

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
