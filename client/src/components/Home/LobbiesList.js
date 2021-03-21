import { useState, useEffect, useContext } from "react";
import { Table, Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import "./css/LobbiesList.css";
import "./css/Common.css";

import CreateGameModal from "./CreateGameModal";

import { PlayerContext } from "../../App";

export default function LobbiesList() {
	const [lobbiesList, setLobbiesList] = useState([]);

	const [createGameModalView, setCreateGameModalView] = useState(false);

	const { socket } = useContext(PlayerContext);

	useEffect(() => {
		socket.emit("getLobbiesList", ({ lobbiesList }) => {
			console.log(lobbiesList);
			setLobbiesList(lobbiesList);
		});

		socket.on("lobbyCreated", (lobby) => {
			setLobbiesList((prevList) => [...prevList, lobby]);
		});

		socket.on("lobbyStopped", ({ name }) => {
			setLobbiesList((prevList) => prevList.filter((lobby) => lobby.name != name));
		});
	}, []);

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
								<Button variant="success" id="open-create-game-modal-button" onClick={() => setCreateGameModalView(true)}>
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
										<Button id={"join-button-" + index} variant="primary">
											Join
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</div>
			<CreateGameModal modalView={createGameModalView} setModalView={setCreateGameModalView} />
		</>
	);
}
