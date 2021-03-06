import React from "react";
import {
	Button,
	Card,
	Form,
	Alert
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import { PlayerContext } from "../../App";
import { Redirect } from "react-router";

export default function AuthModal() {

	const {updateNickname, socket, nickname: kek} = React.useContext(PlayerContext);
	const [nickname, setNickname] = React.useState("");
	const [nicknameError, setNicknameError] = React.useState(false);

	const trySetNickname = (nick) => {
		socket.emit("nicknameAvailable", { nickname: nick }, response => {
			console.log("inside callback: ", response);
			if (response.ok) {
				updateNickname(nickname);
			} else {
				setNicknameError(true);
			}
		});

	} 

	if (kek != "") {
		return <Redirect to="/" />
	}

	return (
		<div className="vh-100 d-flex justify-content-center flex-column align-items-center">
			<Card>
				<Card.Body>
					{nicknameError && <Alert variant="danger">This nickname is already taken!</Alert>}
					<Form>
						<Form.Group>
							<Form.Label>Enter your nickname:</Form.Label>
							<Form.Control type="text" placeholder="nickname" maxLength="16" autoFocus required onChange={(e) => setNickname(e.target.value)} />                        
						</Form.Group>
						<Button block onClick={() => trySetNickname(nickname)}>Submit</Button>
					</Form>
				</Card.Body>
			</Card>
		</div>
	);
}