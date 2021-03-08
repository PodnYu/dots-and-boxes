import React, { useState } from "react";
import { Form } from "react-bootstrap";

import { CSSTransition } from "react-transition-group";

import "./GameField.css";

import generateGameField from "./GameFieldGenerating";

import range from "../../range";

export default function GameField({ gameFieldParameters }) {
	const [animationState, setAnimationState] = useState(true);

	const [fieldParameters] = useState({ ...gameFieldParameters });
	const [sizeSelectorsValue] = useState({ ...gameFieldParameters });

	const gameField = generateGameField(fieldParameters.width, fieldParameters.height);

	return (
		<div id="game-field-container">
			<div className="d-inline-flex justify-content-center" id="game-field-size-selectors-container">
				<GameFieldParameterSelector
					selectorName={"Width"}
					selectorParameter={"width"}
					fieldParameters={fieldParameters}
					updateParameter={updateParameter}
				/>
				<GameFieldParameterSelector
					selectorName={"Height"}
					selectorParameter={"height"}
					fieldParameters={fieldParameters}
					updateParameter={updateParameter}
				/>
			</div>

			<CSSTransition
				in={animationState}
				appear={true}
				timeout={500}
				classNames="game-field"
				onExited={() => {
					fieldParameters.width = sizeSelectorsValue.width;
					fieldParameters.height = sizeSelectorsValue.height;
					setAnimationState(true);
				}}>
				<div className={"d-flex flex-column justify-content-center align-items-center"} id="game-field">
					{gameField}
				</div>
			</CSSTransition>
		</div>
	);

	function updateParameter(parameter, parameterValue) {
		sizeSelectorsValue[parameter] = parameterValue;
		setAnimationState(false);
	}
}

function GameFieldParameterSelector({ selectorName: name, selectorParameter: parameter, fieldParameters, updateParameter }) {
	return (
		<div className="d-flex flex-column align-items-center game-field-size-selector">
			<Form.Label className="mr-sm-2" htmlFor={`field-${parameter}-select`}>
				{name}
			</Form.Label>
			<Form.Control
				as="select"
				custom
				className="mr-sm-2"
				id={`field-${parameter}-select`}
				defaultValue={fieldParameters[parameter]}
				onChange={(event) => updateParameter(parameter, +event.target.value)}>
				{range(2, 8).map((item) => {
					return (
						<option key={item} value={item}>
							{item}
						</option>
					);
				})}
			</Form.Control>
		</div>
	);
}
