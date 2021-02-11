import React, { useState, useContext } from "react";
import { Table } from "react-bootstrap";

import PropTypes from "prop-types";

import "bootstrap/dist/css/bootstrap.min.css";

import "./PlayersList.css";
import "../Common.css";

import { SocketContext } from "../../../App.js";

export default function PlayersList() {
	const [playersList, setPlayersList] = useState({});

	const socket = useContext(SocketContext);

	socket.on("playersList", (players) => {
		setPlayersList(players);
	});

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
					{Object.entries(playersList).map((player, index) => {
						return (
							<tr key={player}>
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
