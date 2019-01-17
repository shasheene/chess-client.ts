import {BOARD_ROWS, BOARD_COLUMNS, LIGHT_CHECKER_PATTERN_COLOUR, DARK_CHECKER_PATTERN_COLOUR, NUM_WIDTH_PIXELS_PER_CHECKER_BOX, NUM_HEIGHT_PIXELS_PER_CHECKER_BOX, CANVAS_WIDTH, CANVAS_HEIGHT, Coordinate} from "./constants"

class Board{
	canvas: HTMLCanvasElement;

	constructor() {
		this.canvas = <HTMLCanvasElement>document.createElement('canvas');
		// Bind board object to the mouse down handler function so the function execution can access the board instance via the 'this' keyword.
		let mouseDownHandlerBound = this.mouseDownHandler.bind(this);
		this.canvas.addEventListener("mousedown", mouseDownHandlerBound, false);
		this.canvas.width=CANVAS_WIDTH;
		this.canvas.height=CANVAS_HEIGHT;
		document.body.appendChild(this.canvas);
	}

	mouseDownHandler(event: MouseEvent): void {
		let mouse_pixel_coords = {x_offset: event.x, y_offset: event.y};
		let checker_index = this.getCheckerIndexFromPixelOffset(mouse_pixel_coords);
		alert('mouse_pixel at x=' + mouse_pixel_coords.x_offset + ' y=' + mouse_pixel_coords.y_offset
				+ ' maps to row #'+ checker_index.y_offset + ', column #' + checker_index.x_offset);
	}

	/**
	 * Draws board checker pattern, and populates game pieces.
	 * 
	 * @param canvas Constructed HTML canvas
	 */
	drawBoard(canvas: HTMLCanvasElement) {
		let context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Loop over each checker square
		for (let row_index = 0; row_index < BOARD_ROWS; row_index++) {
			for (let column_index = 0; column_index < BOARD_COLUMNS; column_index++) {
				let checker_index = {x_offset: column_index, y_offset: row_index};
				let checker_pixel_coord = this.getPixelOffsetFromCheckerIndex(checker_index);
				if (this.isCheckerIndexWhite(checker_index)) {
					context.fillStyle = LIGHT_CHECKER_PATTERN_COLOUR;
				} else {
					context.fillStyle = DARK_CHECKER_PATTERN_COLOUR;
				}
				context.fillRect(checker_pixel_coord.x_offset, checker_pixel_coord.y_offset, NUM_WIDTH_PIXELS_PER_CHECKER_BOX, NUM_HEIGHT_PIXELS_PER_CHECKER_BOX);	
			}
		}
	}

	getPixelOffsetFromCheckerIndex(board_coord: Coordinate): Coordinate {
		return {
			x_offset: board_coord.x_offset * NUM_WIDTH_PIXELS_PER_CHECKER_BOX,
			y_offset: board_coord.y_offset * NUM_HEIGHT_PIXELS_PER_CHECKER_BOX
		};
	}

	getCheckerIndexFromPixelOffset(pixel_coord: Coordinate): Coordinate {
		return {
			x_offset: Math.floor(pixel_coord.x_offset / NUM_WIDTH_PIXELS_PER_CHECKER_BOX),
			y_offset: Math.floor(pixel_coord.y_offset / NUM_HEIGHT_PIXELS_PER_CHECKER_BOX)
		};
	}

	isCheckerIndexWhite(board_index: Coordinate): boolean {
		if ((board_index.x_offset % 2) == 0) {
			return (board_index.y_offset % 2) == 0;
		} else {
			return (board_index.y_offset % 2) != 0;
		}
	}

	start() {
			this.drawBoard(this.canvas);
	}
}

export = Board;