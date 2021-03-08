import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Form, FormControl, Button, Modal } from "react-bootstrap";

import PropTypes from "prop-types";

import "bootstrap/dist/css/bootstrap.min.css";

import "./CreateGameModal.css";
import "../Common.css";

import { PlayerContext } from "../../../App";

import GameParametersSelector from "./GameParametersSelector/GameParametersSelector";

export default function CreateGameModal({ modalView, setModalView }) {
	const { socket } = useContext(PlayerContext);

	const parameters = { name: "", width: 2, height: 2, playersCount: 2 };

	function setParameter(parameter, value) {
		parameters[parameter] = value;
	}

	return (
		<Modal show={modalView} onHide={() => setModalView(false)} id="create-game-modal">
			<Modal.Header closeButton>
				<Modal.Title>Configure your game</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form id="create-game-modal-body">
					<Form.Group>
						<Form.Label htmlFor="lobby-name-input">Game name:</Form.Label>
						<FormControl type="text" id="lobby-name-input" placeholder="lel?" onChange={updateLobbyName} />
					</Form.Group>
					<Form.Row>
						<GameParametersSelector parameterNameValues={["Width", "width", "width"]} optionsCount={8} setParameter={setParameter} />
						<GameParametersSelector parameterNameValues={["Height", "height", "height"]} optionsCount={8} setParameter={setParameter} />
						<GameParametersSelector
							parameterNameValues={["Number of players", "players-count", "playersCount"]}
							optionsCount={4}
							setParameter={setParameter}
							columnSize={6}
						/>
					</Form.Row>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Link to={{ pathname: "/lobby", parameters }}>
					<Button variant="primary" onClick={createLobby}>
						Create Lobby
					</Button>
				</Link>
			</Modal.Footer>
		</Modal>
	);

	function updateLobbyName(event) {
		setParameter("name", event.target.value);
	}

	function createLobby() {
		socket.emit("createLobby", parameters);
	}
}

CreateGameModal.propTypes = {
	modalView: PropTypes.bool.isRequired,
	setModalView: PropTypes.func.isRequired,
};
