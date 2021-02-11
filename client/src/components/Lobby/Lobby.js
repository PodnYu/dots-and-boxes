import React from "react";
import { useLocation } from "react-router-dom";

import "./Lobby.css";

import GameField from "./GameField/GameField";
import OpponentsList from "./OpponentsList/OpponentsList";

export default function Lobby() {
	const defaultParameters = {
		width: 2,
		height: 2,
		playersCount: 2,
	};

	let gameFieldParameters = useLocation().parameters || defaultParameters;

	return (
		<div id="lobby-container">
			<GameField gameFieldParameters={gameFieldParameters} />
			<OpponentsList userType={gameFieldParameters.userType} />
		</div>
	);
}
