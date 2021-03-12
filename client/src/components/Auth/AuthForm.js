import React, { useState, useContext } from "react";
import { Redirect } from "react-router";
import { Button, Card, Form, Alert } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import { PlayerContext } from "../../App";

export default function AuthModal() {
	const { socket, nickname, setNickname } = useContext(PlayerContext);

	const [enteredText, setEnteredText] = useState("");
	const [nicknameError, setNicknameError] = useState(false);

	if (nickname != "") return <Redirect to="/" />;

	const createPlayer = (nickname) => {
		socket.emit("createPlayer", { nickname }, (response) => {
			console.log("inside callback: ", response);

			if (response.ok) {
				setNickname(nickname);
			} else {
				setNicknameError(true);
			}
		});
	};

	const onKeyPressed = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();

			createPlayer(enteredText);
		}
	};

	return (
		<div className="vh-100 d-flex justify-content-center flex-column align-items-center">
			<Card>
				<Card.Body>
					{nicknameError && <Alert variant="danger">This nickname is already taken!</Alert>}
					<Form>
						<Form.Group>
							<Form.Label>Enter your nickname:</Form.Label>
							<Form.Control
								type="text"
								placeholder="nickname"
								maxLength="16"
								onKeyPress={onKeyPressed}
								onChange={(e) => setEnteredText(e.target.value)}
								autoFocus
								required
							/>
						</Form.Group>
						<Button block onClick={() => createPlayer(enteredText)}>
							Submit
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</div>
	);
}
