import { Form, Col } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import range from "../../utils/range";

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
				{range(2, optionsCount).map((item) => {
					return (
						<option key={item} value={item}>
							{item}
						</option>
					);
				})}
			</Form.Control>
		</Form.Group>
	);
}
