// TODO: Extract into a 'constants.ts' and import
const CANVAS_WIDTH=400;
const CANVAS_HEIGHT=400;

const BOARD_ROWS=8;
const BOARD_COLUMNS=8;

const NUM_WIDTH_PIXELS_PER_CHECKER_BOX = CANVAS_WIDTH/BOARD_COLUMNS;
const NUM_HEIGHT_PIXELS_PER_CHECKER_BOX = CANVAS_HEIGHT/BOARD_ROWS;

const DARK_CHECKER_PATTERN_COLOUR="rgb(75,75,75)";
const LIGHT_CHECKER_PATTERN_COLOUR="rgb(200,200,200)";

type Coordinate = {x_offset: number, y_offset: number};

function mouseDownHandler(event: MouseEvent): void {
   var x: number = event.x;
   var y: number = event.y;
   alert('x=' + x + ' y=' + y);
}

/**
 * Draws board checker pattern, and populates game pieces.
 * 
 * @param canvas Constructed HTML canvas
 */
function drawBoard(canvas: HTMLCanvasElement) {
	let ctx = canvas.getContext("2d");

	// Loop over each checker square
	for (let row_index = 0; row_index < BOARD_ROWS; row_index++) {
		for (let column_index = 0; column_index < BOARD_COLUMNS; column_index++) {
			let checker_index = {x_offset: column_index, y_offset: row_index};
			let checker_pixel_coord = getPixelOffsetFromCheckerIndex(checker_index);
			if (isCheckerIndexWhite(checker_index)) {
				ctx.fillStyle = LIGHT_CHECKER_PATTERN_COLOUR;
			} else {
				ctx.fillStyle = DARK_CHECKER_PATTERN_COLOUR;
			}
			ctx.fillRect(checker_pixel_coord.x_offset, checker_pixel_coord.y_offset, NUM_WIDTH_PIXELS_PER_CHECKER_BOX, NUM_HEIGHT_PIXELS_PER_CHECKER_BOX);	
		}
	}
}

function getPixelOffsetFromCheckerIndex(board_index: Coordinate): Coordinate {
	return {
		x_offset: board_index.x_offset * NUM_WIDTH_PIXELS_PER_CHECKER_BOX,
		y_offset: board_index.y_offset * NUM_HEIGHT_PIXELS_PER_CHECKER_BOX
	};
}

function isCheckerIndexWhite(board_index: Coordinate): boolean {
	// Temporarily drawing even/odd columns as dark/white to test application.
	// TODO: Use correct checkerboard formula.
	return ((board_index.x_offset % 2) == 0);
}

window.onload = () => {
		let canvas = <HTMLCanvasElement>document.createElement('canvas');
		canvas.addEventListener("mousedown", mouseDownHandler, false);
		canvas.width=CANVAS_WIDTH;
		canvas.height=CANVAS_HEIGHT;
		document.body.appendChild(canvas);
		drawBoard(canvas);
};
