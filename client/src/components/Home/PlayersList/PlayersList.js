import React, { useState, useContext } from "react";
import { Table } from "react-bootstrap";

import PropTypes from "prop-types";

import "bootstrap/dist/css/bootstrap.min.css";

import "./PlayersList.css";
import "../Common.css";

import { PlayerContext } from "../../../App.js";

export default function PlayersList() {
	const [playersList, setPlayersList] = useState([]);
	const { socket, nickname } = useContext(PlayerContext);

	React.useEffect(() => {
		console.log("playersList has changed: ", playersList);
	}, [playersList]);

	React.useEffect(() => {
		console.log("init PlayersList render");

		socket.on("playerJoin", ({ nickname }) => {
			console.log("playerJoin: ", nickname);
			setPlayersList(prevList => [...prevList, nickname]);
		});
	
		socket.on("playerLeave", ({ nickname }) => {
			console.log("playerLeave: ", nickname);
			setPlayersList(prevList => prevList.filter(player => player != nickname));
		});	


		socket.emit("createPlayer", { nickname }, response => {
			console.log("inside createPlayer callback: ", response);
			setPlayersList(response.playersList);
		});
	}, []);

	// React.useEffect(() => {
	// 	console.log("PlayersList render");
	// });

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

PlayersList.propTypes = {
	socket: PropTypes.object,
};
