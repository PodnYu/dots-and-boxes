import React, { useState } from "react";

import { Table, Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import "./LobbiesList.css";
import "../Common.css";

import Modal from "../CreateGameModal/CreateGameModal.js";

export default function LobbyList() {
	let [showModal, setShowModal] = useState(false);

	const toggleModalView = () => {
		setShowModal(!showModal);
	};

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
					</tbody>
				</Table>
			</div>
			{showModal && <Modal toggleModalView={toggleModalView} />}
		</>
	);
}
