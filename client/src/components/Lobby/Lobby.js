import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import "./Lobby.css";

import GameField from "./GameField/GameField";
import OpponentsList from "./OpponentsList/OpponentsList";

import { PlayerContext } from "../../App";

export default function Lobby(props) {
	const { socket } = useContext(PlayerContext);
	const { nickname } = useContext(PlayerContext);

	const [isPlayerHost, setIsPlayerHost] = useState(null);

	const history = useHistory();

	const [lobbyExisting, setLobbyExisting] = useState(null);

	const [lobbyParameters] = useState({});

	useEffect(() => {
		socket.emit("joinPlayer", { name: props.match.params.name }, (response) => {
			if (response.status) {
				lobbyParameters.fieldParameters = response.fieldParameters;
				lobbyParameters.playersParameters = response.fieldParameters;

				setIsPlayerHost(nickname == lobbyParameters.fieldParameters.host);

				setLobbyExisting(true);
			} else setLobbyExisting(false);
		});

		return () => {
			socket.emit("leavePlayer");
		};
	}, []);

	if (lobbyExisting === true)
		return (
			<div id="lobby-container">
				<GameField isPlayerHost={isPlayerHost} gameFieldParameters={lobbyParameters.fieldParameters} />
				<OpponentsList isPlayerHost={isPlayerHost} playersParameters={lobbyParameters.playersParameters} />
			</div>
		);
	else if (lobbyExisting === false) {
		setTimeout(() => {
			history.push("/");
		}, 2000);

		return <h1>De bil, huli</h1>;
	} else {
		return <h1>Wait a minute...</h1>;
	}
}
