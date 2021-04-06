import { useState, useEffect, useContext } from "react";
import { Table, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import "./css/LobbiesList.css";
import "./css/Common.css";

import CreateGameModal from "./CreateGameModal";

import { PlayerContext } from "../../App";

export default function LobbiesList() {
	const [lobbiesList, setLobbiesList] = useState([]);

	const [createGameModalView, setCreateGameModalView] = useState(false);

	const { socket } = useContext(PlayerContext);

	const history = useHistory();

	useEffect(() => {
		socket.emit("getLobbiesList", ({ lobbiesList }) => {
			console.log("lobbiesList: ", lobbiesList);
			setLobbiesList(lobbiesList);
		});

		socket.on("lobbyCreated", ({ lobby }) => {
			console.log("lobbyCreated: ", lobby);
			setLobbiesList((prevList) => [...prevList, lobby]);
		});

		socket.on("lobbyStopped", ({ name }) => {
			setLobbiesList((prevList) => prevList.filter((lobby) => lobby.name != name));
		});

		socket.on("placeChanged", ({ lobbyName, playersCount, placesCount }) => {
			console.log("placeChanged: ", lobbyName, playersCount, placesCount);
			setLobbiesList(oldLobbiesList => {
				const newLobbiesList = [ ...oldLobbiesList ];
				const lobby = newLobbiesList.find(lobby => lobby.name === lobbyName);
				if (!lobby)
					return oldLobbiesList;
				
				lobby.playersCount = playersCount;
				lobby.placesCount = placesCount;
				return newLobbiesList;
			});
		});

		return () => {
			socket.off("lobbyCreated");
			socket.off("lobbyStopped");
			socket.off("placeChanged");
		};
	}, []);

	const tryJoinLobby = (e) => {
		const lobbyIndex = e.target.id.split("-")[2];
		const lobby = lobbiesList[lobbyIndex];

		socket.emit("home/isLobbyAvailable", { lobbyName: lobby.name }, (response) => {
			console.log("home/isLobbyAvailable response: ", response);
			if (response.ok) {
				history.push(`/lobby/${lobby.name}`);
			}
		});
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
								Player Nickname
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
						{lobbiesList.map((lobby, index) => {
							return (
								<tr key={lobby}>
									<th scope="row" className="align-middle">
										{index + 1}
									</th>
									<td className="align-middle">{lobby.hostNickname}</td>
									<td className="align-middle">{lobby.name}</td>
									<td className="align-middle">{lobby.playersCount}/{lobby.placesCount}</td>
									<td className="align-middle">
										{lobby.width}x{lobby.height}
									</td>
									<td className="align-middle">
										<Button id={"join-button-" + index} variant="primary" onClick={tryJoinLobby}>
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
