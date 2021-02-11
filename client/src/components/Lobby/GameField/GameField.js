import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

import { CSSTransition } from "react-transition-group";

import "./GameField.css";

export default function GameField({ gameFieldParameters }) {
	const [gameFieldState, setGameFieldState] = useState(gameFieldParameters);
	const [animationState, setAnimationState] = useState(true);

	const widthSelectorRef = useRef();
	const heightSelectorRef = useRef();

	const gameFieldRef = useRef();

	useEffect(() => {
		widthSelectorRef.current.value = gameFieldState.width;
		heightSelectorRef.current.value = gameFieldState.height;
	}, []);

	let gameField = generateGameField(gameFieldState.width, gameFieldState.height);

	return (
		<div id="game-field-container">
			<div className="d-inline-flex justify-content-center" id="game-field-size-selectors-container">
				<div className="d-flex flex-column align-items-center game-field-size-selector">
					<Form.Label className="mr-sm-2" htmlFor="field-height-select">
						Width
					</Form.Label>
					<Form.Control
						ref={widthSelectorRef}
						as="select"
						custom
						className="mr-sm-2"
						id="field-height-select"
						onChange={updateWidth}>
						{new Array(7).fill("").map((_, index) => {
							return (
								<option key={index + 2} value={index + 2}>
									{index + 2}
								</option>
							);
						})}
					</Form.Control>
				</div>
				<div className="d-flex flex-column align-items-center game-field-size-selector">
					<Form.Label className="mr-sm-2" htmlFor="field-height-select">
						Height
					</Form.Label>
					<Form.Control
						ref={heightSelectorRef}
						as="select"
						custom
						className="mr-sm-2"
						id="field-width-select"
						onChange={updateHeight}>
						{new Array(7).fill("").map((_, index) => {
							return (
								<option key={index + 2} value={index + 2}>
									{index + 2}
								</option>
							);
						})}
					</Form.Control>
				</div>
			</div>

			<CSSTransition
				ref={gameFieldRef}
				in={animationState}
				appear={true}
				timeout={500}
				classNames="game-field"
				onExited={() => {
					setAnimationState(true);
				}}>
				<div className={"d-flex flex-column justify-content-center align-items-center"} id="game-field">
					{gameField}
				</div>
			</CSSTransition>
		</div>
	);

	function updateWidth(event) {
		setAnimationState(false);

		setTimeout(() => {
			setGameFieldState((previousState) => {
				return { ...previousState, width: +event.target.value };
			});
		}, 500);
	}

	function updateHeight(event) {
		setAnimationState(false);

		setTimeout(() => {
			setGameFieldState((previousState) => {
				return { ...previousState, height: +event.target.value };
			});
		}, 500);
	}

	function generateDot(id) {
		return <div className="dot" id={`dot_${id.length == 1 ? "0" + id : id}`}></div>;
	}

	function generateEdge(firstDot, secondDot, plane) {
		switch (plane) {
			case "vertical":
				return <div className="edge-vertical" id={`edge_${firstDot}_${secondDot}`}></div>;
			case "horizontal":
				return <div className="edge-horizontal" id={`edge_${firstDot}_${secondDot}`}></div>;
		}
	}

	function generateSquare() {
		return <div className="square"></div>;
	}

	function generateHorizontalLine(edgesCount, lineNo) {
		let horizontalLineItems = [];

		let dotsCount = edgesCount + 1;

		for (let j = 0; j < edgesCount; j++) {
			let dotNo = dotsCount * lineNo + j;

			horizontalLineItems.push(generateDot(dotNo));
			horizontalLineItems.push(generateEdge(dotNo, dotNo + 1, "horizontal"));
		}

		horizontalLineItems.push(generateDot(dotsCount * lineNo + edgesCount));

		return <div className="d-inline-flex">{horizontalLineItems}</div>;
	}

	function generateVerticalLine(edgesCount, lineNo) {
		let verticalLineItems = [];

		let dotsCount = edgesCount + 1;

		for (let j = 0; j < edgesCount; j++) {
			let dotNo = dotsCount * lineNo + j;

			verticalLineItems.push(generateEdge(dotNo, dotNo + dotsCount, "vertical"));
			verticalLineItems.push(generateSquare());
		}

		verticalLineItems.push(
			generateEdge(dotsCount * lineNo + edgesCount, dotsCount * (lineNo + 1) + edgesCount, "vertical"),
		);

		return <div className="d-inline-flex">{verticalLineItems}</div>;
	}

	function generateGameField(width, height) {
		let gameField = [];

		for (let i = 0; i < height; i++) {
			gameField.push(generateHorizontalLine(width, i));
			gameField.push(generateVerticalLine(width, i));
		}

		gameField.push(generateHorizontalLine(width, height));

		return gameField;
	}
}

GameField.propTypes = {
	gameFieldParameters: PropTypes.objectOf(Number),
};
