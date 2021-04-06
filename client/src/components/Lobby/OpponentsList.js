import { useState, useEffect, useContext, useRef } from "react";
import { PlayerContext } from "../../App";
import { Table, Form, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "./css/OpponentsList.css";

export default function OpponentsList(props) {
	const { socket, nickname } = useContext(PlayerContext);

	const [places, setPlaces] = useState(props.playersParameters);

	const history = useHistory();

	const errorMessageRef = useRef();
	
	useEffect(() => {

		if (props.isPlayerHost) {
			const playersParameters = [];
			playersParameters.push({ opened: true, playerNickname: nickname, color: null });
			for (let i = 1; i < 4; ++i) {
				playersParameters.push({ opened: props.placesCount > i ? true : false, playerNickname: null, color: null });
			}
			setPlaces(playersParameters);
		}

		socket.on("lobby/playerJoined", ({ playerNickname, placeIndex, color }) => {
			console.log("lobby/playerJoined: ", playerNickname, placeIndex, color);
			setPlaces(oldPlaces => {
				console.log("\tplayerJoined");
				const newPlaces = [ ...oldPlaces ];
				newPlaces[placeIndex] = { opened: true, playerNickname, color };
				return newPlaces;
			});
		});

		socket.on("lobby/playerLeft", ({ playerNickname }) => {
			console.log("lobby/playerLeft: ", playerNickname);
			setPlaces(oldPlaces => {
				const newPlaces = [...oldPlaces];
				const index = newPlaces.findIndex(place => place.playerNickname === playerNickname);

				if (index === -1)
					return oldPlaces;

				newPlaces[index] = { opened: true, playerNickname: null, color: null };

				return newPlaces;
			});
		});

		socket.on("lobby/hostLeft", () => {
			console.log("lobby/hostLeft");
			errorMessageRef.current.textContent = "Host has left";
			setTimeout(() => {
				history.push("/");
			}, 3000);
		});

		socket.on("lobby/removedByHost", () => {
			errorMessageRef.current.textContent = "Host has removed you";
			setTimeout(() => {
				history.push("/");
			}, 3000);
		});

		return () => {
			socket.off("lobby/playerJoined");
			socket.off("lobby/playerLeft");
			socket.off("lobby/hostLeft");
			socket.off("lobby/removedByHost");
		};
	}, []);

	const togglePlace = (e) => {
		const playerIndex = e.target.id.split("-")[1];
		const placeOpened = e.target.value === "opened" ? true : false;

		setPlaces(oldPlaces => {
			const newPlaces = [ ...oldPlaces ];
			newPlaces[playerIndex].opened = placeOpened;
			newPlaces[playerIndex].playerNickname = null;
			newPlaces[playerIndex].color = null;
			return newPlaces;
		});

		socket.emit("lobby/placeChanged", { 
			lobbyName: props.lobbyName, 
			placeIndex: playerIndex, 
			opened: placeOpened
		}, (response) => {

			/*
				Idk if we need this callback.
			*/

			console.log("lobby/placeChanged response: ", response);
			if (!response.ok) {
				console.error("not ok");
			}

		});
	}; 

	const getSelfRow = (index) => <tr key={index} className="player" id={`player-${index}`}>
		<td className="align-middle nickname">{nickname}</td>
		<td className="align-middle">
			<Form.Control as="select" custom id={`select-${index}`} onChange={colorSelectorListener}>
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
	</tr>;

	return (
		<>
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

					{places.map((place, index) => {
						return place.playerNickname === nickname ? (
							getSelfRow(index)
						) : (
							<tr key={index} className="player" id={"select-" + index}>
								<td className="nickname align-middle">
									{props.isPlayerHost ? <Form.Control 
										as="select" 
										value={place.playerNickname ? "nickname" : ((place.opened) ? "opened" : "closed")}
										custom 
										id={"select-" + index} 
										onChange={togglePlace}>
										{ place.playerNickname && <option value="nickname">{place.playerNickname}</option> }
										<option value="opened">Opened</option>
										<option value="closed">Closed</option>
									</Form.Control> : 
										<>
											{place.playerNickname ? place.playerNickname : place.opened ? "opened" : "closed"}
										</>
									}
								</td>
								<td className="align-middle"></td>
								<td className="text-center align-middle">0</td>
							</tr>
						);
					})}

					{/* {[1, 2, 3].map(el => {
						return (
							<tr key={el} className="player" id={"select-" + el}>
								<td className="nickname align-middle">
									<Form.Control as="select" defaultValue={(props.placesCount > el) ? "opened" : "closed"} custom id={"select-" + el} onChange={togglePlace}>
										<option value="opened">Opened</option>
										<option value="closed">Closed</option>
									</Form.Control>
								</td>
								<td className="align-middle"></td>
								<td className="text-center align-middle">0</td>
							</tr>
						);
					})} */}

				</tbody>
			</Table>
			<div id="go-back-button">
				<div ref={errorMessageRef} id="error-message">
				</div>
				<Link to="/">
					<Button>Go Back</Button>
				</Link>
			</div>
		</>
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
