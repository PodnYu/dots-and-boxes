import React, { useEffect } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import "./CreateGameModal.css";
import "../Common.css";

export default function CreateGameModal({ toggleModalView }) {
	const history = useHistory();
	const parameters = { width: "2", height: "2", playerCount: "2" };

	useEffect(() => {
		let createGameModal = document.getElementById("create-game-modal");

		window.addEventListener(
			"click",
			(event) => {
				if (event.target == createGameModal) {
					toggleModalView();
				}
			},
			{ once: true },
		);
	});

	return (
		<div id="create-game-modal">
			<div id="modal-content">
				<span id="close-modal-span" onClick={toggleModalView}>
					&times;
				</span>
				<div id="create-game-modal-header">
					<h2>Configure your game</h2>
				</div>
				<div id="create-game-modal-body">
					<Form>
						<Form.Group>
							<label htmlFor="lobby-name-input">Game name:</label>
							<FormControl type="text" id="lobby-name-input" placeholder="lel?" />
						</Form.Group>

						<Form.Row>
							<div className="col-3 my-1 align-center">
								<Form.Label className="mr-sm-2" htmlFor="field-width-select">
									Width
								</Form.Label>
								<Form.Control
									as="select"
									custom
									className="mr-sm-2"
									id="field-width-select"
									onChange={(event) => {
										parameters.width = event.target.value;
									}}
								>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
									<option value="6">6</option>
									<option value="7">7</option>
									<option value="8">8</option>
								</Form.Control>
							</div>
							<div className="col-3 my-1 align-center">
								<Form.Label className="mr-sm-2" htmlFor="field-height-select">
									Height
								</Form.Label>
								<Form.Control
									as="select"
									custom
									className="mr-sm-2"
									id="field-height-select"
									onChange={(event) => {
										parameters.height = event.target.value;
									}}
								>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
									<option value="6">6</option>
									<option value="7">7</option>
									<option value="8">8</option>
								</Form.Control>
							</div>
							<div className="col-6 my-1 align-center">
								<Form.Label className="mr-sm-2" htmlFor="number-of-players-input">
									{" "}
									Number of players
								</Form.Label>
								<Form.Control
									as="select"
									custom
									className="mr-sm-2"
									id="number-of-players-input"
									onChange={(event) => {
										parameters.playerCount = event.target.value;
									}}
								>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
								</Form.Control>
							</div>
						</Form.Row>
					</Form>
				</div>
				<div id="create-game-modal-footer" className="d-flex justify-content-end">
					<Button
						variant="primary"
						id="create-game-button"
						onClick={() => {
							history.push({
								pathname: "/lobby",
								parameters: parameters,
							});
						}}
					>
						<div>create</div>
					</Button>
				</div>
			</div>
		</div>
	);
}
