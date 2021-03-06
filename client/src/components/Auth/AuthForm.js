import React from "react";
import {
	Button,
	Card,
	Form
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import { PlayerContext } from "../../App";

export default function AuthModal() {

	const {updateNickname, socket} = React.useContext(PlayerContext);
	const [nickname, setNickname] = React.useState("");

	const trySetNickname = (nick) => {
		// checkNickname(nick).then(data => {
		// 	if (data.ok) {
		// 		updateNickname(nick);
		// 	}
		// });
		socket.emit("nicknameAvailable", { nickname: nick }, response => {
			if (response.ok) {
				updateNickname(nickname);
			}
		});

	} 

	return (
		<div className="vh-100 d-flex justify-content-center flex-column align-items-center">
			<Card>
				<Card.Body>
					<Form>
						<Form.Group>
							<Form.Label>Enter your nickname:</Form.Label>
							<Form.Control type="text" placeholder="nickname" maxLength="16" autoFocus required onChange={(e) => setNickname(e.target.value)} />                        
						</Form.Group>
						<Button block onClick={() => updateNickname(nickname)}>Submit</Button>
					</Form>
				</Card.Body>
			</Card>
		</div>
	);
}