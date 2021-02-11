import React, { useState, useContext } from "react";

import { Table, Button } from "react-bootstrap";

import PropTypes from "prop-types";

import "bootstrap/dist/css/bootstrap.min.css";

import "./LobbiesList.css";
import "../Common.css";

import Modal from "../CreateGameModal/CreateGameModal.js";

import { SocketContext } from "../../../App.js";

export default function LobbiesList() {
	let [modalView, setModalView] = useState(false);
	const [lobbiesList, setLobbiesList] = useState({});

	const socket = useContext(SocketContext);

	const toggleModalView = () => {
		setModalView(!modalView);
	};
	socket.on("lobbiesList", (lobbies) => {
		setLobbiesList(lobbies);
	});
	console.log(lobbiesList);

	return (
		<>
			<div id="lobbies-list-container">
				<Table>
					<thead>
						<tr>
							<th scope="col" className="align-middle row-no">
								#
							</th>
							<th scope="col" className="align-middle lobby-name">
								Lobby Name
							</th>
							<th scope="col" className="align-middle text-align-center players-count">
								Players
							</th>
							<th scope="col" className="align-middle text-align-center field-size">
								Field
							</th>
							<th scope="col" className="align-middle">
								<Button variant="success" id="open-create-game-modal-button" onClick={toggleModalView}>
									Create
								</Button>
							</th>
						</tr>
					</thead>
					<tbody>
						{Object.values(lobbiesList).map((lobby, index) => {
							return (
								<tr key={lobby}>
									<th scope="row" className="align-middle">
										{index + 1}
									</th>
									<td className="align-middle">{lobby.name}</td>
									<td className="align-middle">?/{lobby.playersCount}</td>
									<td className="align-middle">
										{lobby.width}x{lobby.height}
									</td>
									<td className="align-middle">
										<Button variant="primary">Join</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
					{/* <tbody>
						<tr>
							<th scope="row" className="align-middle">
								1
							</th>
							<td className="align-middle">kek</td>
							<td className="align-middle">3/4</td>
							<td className="align-middle">3x4</td>
							<td className="align-middle">
								<Button variant="primary">Join</Button>
							</td>
						</tr>
						<tr>
							<th scope="row" className="align-middle">
								2
							</th>
							<td className="align-middle">Flex</td>
							<td className="align-middle">1/4</td>
							<td className="align-middle">5x5</td>
							<td className="align-middle">
								<Button variant="primary">Join</Button>
							</td>
						</tr>
						<tr>
							<th scope="row" className="align-middle">
								3
							</th>
							<td className="align-middle">Chill</td>
							<td className="align-middle">1/3</td>
							<td className="align-middle">5x7</td>
							<td className="align-middle">
								<Button variant="primary">Join</Button>
							</td>
						</tr>
					</tbody> */}
				</Table>
			</div>
			{modalView && <Modal toggleModalView={toggleModalView} />}
		</>
	);
}

LobbiesList.propTypes = {
	socket: PropTypes.object,
};
