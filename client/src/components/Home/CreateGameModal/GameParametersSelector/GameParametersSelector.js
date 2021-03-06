import React from "react";
import { Form, Col } from "react-bootstrap";
import PropTypes from "prop-types";

import "bootstrap/dist/css/bootstrap.min.css";

export default function GameParametersSelector({ parameterNameValues, optionsCount, setParameter, columnSize = 3 }) {
	return (
		<Form.Group as={Col} xs={columnSize}>
			<Form.Label className="mr-sm-2" htmlFor={`field-${parameterNameValues[1]}-select`}>
				{parameterNameValues[0]}
			</Form.Label>
			<Form.Control
				as="select"
				custom
				id={`field-${parameterNameValues[1]}-select`}
				onChange={(event) => {
					setParameter(parameterNameValues[2], +event.target.value);
				}}>
				{[...Array(optionsCount - 1).keys()].map((_, index) => {
					return (
						<option key={index + 2} value={index + 2}>
							{index + 2}
						</option>
					);
				})}
			</Form.Control>
		</Form.Group>
	);
}

GameParametersSelector.propTypes = {
	parameterNameValues: PropTypes.array,
	optionsCount: PropTypes.number.isRequired,
	setParameter: PropTypes.func.isRequired,
	columnSize: PropTypes.number,
};
