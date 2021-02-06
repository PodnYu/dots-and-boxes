import React from "react";
import { useLocation } from "react-router-dom";

import "./Lobby.css";

import GameField from "./GameField/GameField";
import OpponentsList from "./OpponentsList/OpponentsList";

export default function Lobby() {
	let gameFieldParameters = useLocation().parameters;

	return (
		<div id="lobby-container">
			<GameField gameFieldParameters={gameFieldParameters} />
			<OpponentsList userType={gameFieldParameters.userType} />
		</div>
	);
}
