import { useState, useEffect, useContext, useRef } from "react";

import "./css/Lobby.css";

import GameField from "./GameField";
import OpponentsList from "./OpponentsList";

import { PlayerContext } from "../../App";
import { useHistory } from "react-router";

/*
	isHost = props.location.state

	if isHost
		get all data from props.location.state and render
	else
		on mount send request for lobby data (and whether the lobby is actually available).
		if lobbyAvailable and got all data
			render
	

*/

export default function Lobby(props) {
	const { socket } = useContext(PlayerContext);

	const [gotData, setGotData] = useState(false);
	const history = useHistory();
	
	const isHost = props.location.state?.isHost;

	const fieldParametersRef = useRef(props.location.state?.fieldParameters);
	const playersParametersRef = useRef(null);

	useEffect(() => {
		console.log("Are you host? ", isHost);
		if (!isHost) {
			socket.emit("joinPlayer", { name: props.match.params.name }, (response) => {
				console.log("joinPlayer response: ", response);
				if (response.ok) {
					fieldParametersRef.current = response.fieldParameters;
					playersParametersRef.current = response.playersParameters;
					setGotData(true);
				} else {
					alert("lobby is not available");
					setTimeout(() => {
						history.push("/");
					}, 0);
				}
			});
		} else {
			socket.emit("home/isLobbyAvailable", { lobbyName: props.match.params.name }, (response) => {
				console.log("home/isLobbyAvailable: ", response);
				if (!response.ok) {
					alert("lobby is not available");
					setTimeout(() => {
						history.push("/");
					}, 1000);
				}
			});
		}

		return () => {
			console.log("Lobby unmount");
			socket.emit("leavePlayer");
		};
	}, []);

	if (isHost) {
		return (
			<div id="lobby-container">
				<GameField isPlayerHost={isHost} gameFieldParameters={fieldParametersRef.current} />
				<OpponentsList 
					isPlayerHost={isHost} 
					playersParameters={[]}
					placesCount={fieldParametersRef.current.playersCount} 
					lobbyName={props.match.params.name}/>
			</div>
		);
	} else {
		return (
			<div id="lobby-container">
				{ gotData &&
					<> 
						<GameField isPlayerHost={isHost} gameFieldParameters={fieldParametersRef.current} />
						<OpponentsList 
							isPlayerHost={isHost} 
							playersParameters={playersParametersRef.current}  
							lobbyName={props.match.params.name}/>
					</>
				}
			</div>
		);
	}

	// if (lobbyExisting === true)
	// 	return (
	// 		<div id="lobby-container">
	// 			<GameField isPlayerHost={isPlayerHost} gameFieldParameters={lobbyParameters.fieldParameters} />
	// 			<OpponentsList isPlayerHost={isPlayerHost} playersParameters={lobbyParameters.playersParameters} />
	// 		</div>
	// 	);
	// else if (lobbyExisting === false) {
	// 	setTimeout(() => {
	// 		history.push("/");
	// 	}, 2000);

	// 	return <h1>De bil, huli</h1>;
	// } else {
	// 	return <h1>Wait a minute...</h1>;
	// }
}
