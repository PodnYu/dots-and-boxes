import React from "react";
import { Table } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import "./PlayersList.css";
import "../Common.css";

export default function PlayerList() {
	return (
		<div id="online-players-list-container">
			<Table>
				<thead>
					<tr>
						<th scope="col" className="row-no">
							#
						</th>
						<th scope="col" className="nickname">
							Nickname
						</th>
						<th scope="col" className="stats">
							Stats
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">1</th>
						<td>Mark</td>
						<td>3/5</td>
					</tr>
					<tr>
						<th scope="row">2</th>
						<td>Telewisor</td>
						<td>0/128</td>
					</tr>
					<tr>
						<th scope="row">3</th>
						<td>Larry</td>
						<td>1/1</td>
					</tr>
				</tbody>
			</Table>
		</div>
	);
}
