import React from "react";
import { Table } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import "./PlayerList.css";
import "../Common.css";

export default function PlayerList() {
	return (
		<div id="online-players-list">
			<Table>
				<thead>
					<tr>
						<th scope="col" style={{ width: "20%" }}>
							#
						</th>
						<th scope="col" style={{ width: "40%" }}>
							Nickname
						</th>
						<th scope="col" style={{ width: "40%" }}>
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
