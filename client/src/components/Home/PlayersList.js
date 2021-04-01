import { useState, useEffect, useContext } from "react";
import { Table } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import "./css/PlayersList.css";
import "./css/Common.css";

import { PlayerContext } from "../../App";

export default function PlayersList() {
	const [playersList, setPlayersList] = useState([]);
	const { socket, nickname } = useContext(PlayerContext);

	useEffect(() => {
		console.log("playersList has changed: ", playersList);
	}, [playersList]);

	useEffect(() => {
		console.log("init PlayersList render");

		socket.emit("getPlayersList", (response) => {
			console.log("inside playersList callback: ", response);
			setPlayersList(response.playersList);
		});

		socket.on("playerEntered", ({ nickname }) => {
			console.log("playerEntered: ", nickname);
			setPlayersList((prevList) => [...prevList, nickname]);
		});

		socket.on("playerJoined", ({ nickname }) => {
			console.log("playerJoined: ", nickname);
			setPlayersList((prevList) => prevList.filter((playerNickname) => playerNickname != nickname));
		});

		socket.on("playerExited", ({ nickname }) => {
			console.log("playerExited: ", nickname);
			setPlayersList((prevList) => prevList.filter((player) => player != nickname));
		});
	}, []);

	return (
		<div id="online-players-list-container">
			<Table>
				<thead>
					<tr>
						<th scope="col" className="row-no">
							#
						</th>
						<th scope="col" className="nickname">
							Nickname
						</th>
						<th scope="col" className="stats">
							Stats
						</th>
					</tr>
				</thead>
				<tbody>
					{playersList.map((player, index) => {
						return (
							<tr key={player} className={nickname == player ? "self-row" : ""}>
								<th scope="row">{index + 1}</th>
								<td>{player}</td>
								<td>?/?</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</div>
	);
}
