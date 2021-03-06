import React from "react";
import { Table, Form } from "react-bootstrap";

import PropTypes from "prop-types";

export default function OpponentsList() {
	return (
		<Table id="opponents-list" className="table">
			<thead>
				<tr className="player">
					<th scope="col">Player</th>
					<th scope="col" className="text-center align-middle">
						Color
					</th>
					<th scope="col" className="text-center align-middle">
						Score
					</th>
				</tr>
			</thead>
			<tbody>
				<tr className="player" id="player_1">
					<td className="align-middle nickname">John Kek</td>
					<td className="align-middle">
						<Form.Control as="select" custom id="select_1" onChange={colorSelectorListener}>
							<option value="none">Choose...</option>
							<option value="blue" className="alert-primary">
								Blue
							</option>
							<option value="green" className="alert-success">
								Green
							</option>
							<option value="yellow" className="alert-warning">
								Yellow
							</option>
							<option value="red" className="alert-danger">
								Red
							</option>
						</Form.Control>
					</td>
					<td className="text-center align-middle">0</td>
				</tr>
				<tr className="player" id="player_2">
					<td className="align-middle nickname">
						<Form.Control as="select" custom id="select_1">
							<option value="closed">Closed</option>
							<option value="opened">Opened</option>
						</Form.Control>
					</td>
					<td className="align-middle"></td>
					<td className="text-center align-middle">0</td>
				</tr>
				<tr className="player" id="player_3">
					<td className="align-middle nickname">
						<Form.Control as="select" custom id="select_1">
							<option value="closed">Closed</option>
							<option value="opened">Opened</option>
						</Form.Control>
					</td>
					<td className="align-middle"></td>
					<td className="text-center align-middle">0</td>
				</tr>
				<tr className="player" id="player_4">
					<td className="nickname align-middle">
						<Form.Control as="select" custom id="select_1">
							<option value="closed">Closed</option>
							<option value="opened">Opened</option>
						</Form.Control>
					</td>
					<td className="align-middle"></td>
					<td className="text-center align-middle">0</td>
				</tr>
			</tbody>
		</Table>
	);
}

function colorSelectorListener(event) {
	let color = event.target.value;
	let playerRow = event.target.parentElement.parentElement;
	let victim = [...playerRow.classList].filter((item) => item.indexOf("alert") > -1);

	victim.forEach((item) => {
		playerRow.classList.remove(item);
	});

	switch (color) {
		case "blue":
			playerRow.classList.add("alert-primary");
			break;
		case "green":
			playerRow.classList.add("alert-success");
			break;
		case "yellow":
			playerRow.classList.add("alert-warning");
			break;
		case "red":
			playerRow.classList.add("alert-danger");
			break;
	}
}
