export default function generateGameField(width, height) {
	let gameField = [];

	for (let i = 0; i < height; i++) {
		gameField.push(generateHorizontalLine(width, i));
		gameField.push(generateVerticalLine(width, i));
	}

	gameField.push(generateHorizontalLine(width, height));

	return gameField;
}

function generateVerticalLine(edgesCount, lineNo) {
	let verticalLineItems = [];

	let dotsCount = edgesCount + 1;

	for (let j = 0; j < edgesCount; j++) {
		let dotNo = dotsCount * lineNo + j;

		verticalLineItems.push(generateEdge(dotNo, dotNo + dotsCount, "vertical"));
		verticalLineItems.push(generateSquare(dotNo));
	}

	verticalLineItems.push(generateEdge(dotsCount * lineNo + edgesCount, dotsCount * (lineNo + 1) + edgesCount, "vertical"));

	return (
		<div key={`verticalLine_${lineNo}`} className="d-inline-flex">
			{verticalLineItems}
		</div>
	);
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

	return (
		<div key={`horizontalLine_${lineNo}`} className="d-inline-flex">
			{horizontalLineItems}
		</div>
	);
}

function generateEdge(firstDot, secondDot, plane) {
	switch (plane) {
		case "vertical":
			return <div key={`edge_${firstDot}_${secondDot}`} className="edge-vertical" id={`edge_${firstDot}_${secondDot}`}></div>;
		case "horizontal":
			return <div key={`edge_${firstDot}_${secondDot}`} className="edge-horizontal" id={`edge_${firstDot}_${secondDot}`}></div>;
	}
}

function generateSquare(dotNo) {
	return <div key={`square_${dotNo}`} className="square"></div>;
}

function generateDot(id) {
	return <div key={`dot_${id.length == 1 ? "0" + id : id}`} className="dot" id={`dot_${id.length == 1 ? "0" + id : id}`}></div>;
}
