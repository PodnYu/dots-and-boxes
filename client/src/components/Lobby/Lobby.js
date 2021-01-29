import React from "react";
import { useLocation } from "react-router-dom";

export default function Lobby() {
	console.log(useLocation().parameters);
	return <div></div>;
}
