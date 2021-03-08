import React from "react";

import "./Lobby.css";

import GameField from "./GameField/GameField";
import OpponentsList from "./OpponentsList/OpponentsList";

export default function Lobby(props) {
	const defaultParameters = { width: 2, height: 2, playersCount: 2 };

	let gameFieldParameters = props.location.parameters || defaultParameters;

	return (
		<div id="lobby-container">
			<GameField gameFieldParameters={gameFieldParameters} />
			<OpponentsList userType={gameFieldParameters.userType} />
		</div>
	);
}
