import React, { useState } from "react";

import { Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "./LobbyList.css";
import "../Common.css";

import Modal from "../CreateGameModal/CreateGameModal.js";

export default function LobbyList() {
	let [showModal, changeDisplay] = useState(false);

	const toggleModalView = () => {
		changeDisplay(!showModal);
	};

	return (
		<>
			<div id="lobbies">
				<Table>
					<thead>
						<tr>
							<th scope="col" style={{ width: "10%" }}>
								#
							</th>
							<th scope="col" className="w-25%">
								Lobby Name
							</th>
							<th scope="col" className="width-20% text-align-center;">
								Players
							</th>
							<th scope="col" style={{ width: "20%" }} className="align-middle;">
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
							<th scope="row">1</th>
							<td>keks</td>
							<td className="align-middle">3/4</td>
							<td className="align-middle">3x4</td>
							<td className="align-middle">
								<Button variant="primary">Join</Button>
							</td>
						</tr>
						<tr>
							<th scope="row">2</th>
							<td>Flex</td>
							<td className="align-middle">1/4</td>
							<td className="align-middle">5x5</td>
							<td className="align-middle">
								<Button variant="primary">Join</Button>
							</td>
						</tr>
						<tr>
							<th scope="row">3</th>
							<td>Chill</td>
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
