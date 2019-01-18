import {BOARD_ROWS, BOARD_COLUMNS, LIGHT_CHECKER_PATTERN_COLOUR, DARK_CHECKER_PATTERN_COLOUR, NUM_WIDTH_PIXELS_PER_CHECKER_BOX, NUM_HEIGHT_PIXELS_PER_CHECKER_BOX, CANVAS_WIDTH, CANVAS_HEIGHT, Coordinate, SELECTED_PIECE_CHECKER_PATTERN_COLOUR, MOVE_SELECTIONS_CHECKER_PATTERN_COLOUR} from "./constants"
import {PlayerColor, TurnState} from "./state_enums"

class Board{
	canvas: HTMLCanvasElement;
	player_color: PlayerColor;
	turn_state: TurnState;
	selected_piece_coords: Coordinate;

	constructor() {
		this.canvas = <HTMLCanvasElement>document.createElement('canvas');
		// Bind board object to the mouse down handler function so the function execution can access the board instance via the 'this' keyword.
		let mouseDownHandlerBound = this.mouseDownHandler.bind(this);
		this.canvas.addEventListener("mousedown", mouseDownHandlerBound, false);
		this.canvas.width=CANVAS_WIDTH;
		this.canvas.height=CANVAS_HEIGHT;
		document.body.appendChild(this.canvas);

		// TODO: Get this from server
		this.player_color = PlayerColor.WHITE;
		this.turn_state = TurnState.NO_PIECE_SELECTED;
		this.selected_piece_coords = {x_offset: 0, y_offset: 0};
	}

	mouseDownHandler(event: MouseEvent): void {
		let mouse_pixel_coords = {x_offset: event.x, y_offset: event.y};
		let checker_index = this.getCheckerIndexFromPixelOffset(mouse_pixel_coords);

		// TODO: Replace with options returned from chess server
		let temp_move_options : Coordinate[];
		if (this.turn_state == TurnState.NO_PIECE_SELECTED) {
			this.selected_piece_coords = checker_index;
			temp_move_options = [{x_offset: 3, y_offset: 5}, {x_offset: 7, y_offset: 2}]
			this.drawBoard(this.selected_piece_coords, temp_move_options);
		} else if (this.turn_state == TurnState.PIECE_SELECTED) {
			// TODO: Send to server
			let target_move_coords = checker_index;
			this.drawBoard();
		}

		// Update turn state
		if (this.turn_state == TurnState.NO_PIECE_SELECTED) {
			this.turn_state = TurnState.PIECE_SELECTED;
		} else if (this.turn_state == TurnState.PIECE_SELECTED) {
			this.turn_state = TurnState.NO_PIECE_SELECTED;
		}
	}

	/**
	 * Draws board checker pattern, and populates game pieces.
	 *
	 * @param selected_checker Coordinate of selected checker square
	 * @param possible_moves Array of moves that @param selected_checker can make
	 */
	drawBoard(selected_checker?: Coordinate, possible_moves?: Coordinate[]) {
		let context = this.canvas.getContext("2d");
		if (context == null) {
			throw new Error("Context was null");
		}
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

		// Draw color under selected checker square
		if (selected_checker != null) {
			let selected_piece_pixel_coords = this.getPixelOffsetFromCheckerIndex(selected_checker);
			context.fillStyle = SELECTED_PIECE_CHECKER_PATTERN_COLOUR;
			context.fillRect(selected_piece_pixel_coords.x_offset, selected_piece_pixel_coords.y_offset, NUM_WIDTH_PIXELS_PER_CHECKER_BOX, NUM_HEIGHT_PIXELS_PER_CHECKER_BOX);
		}

		// Draw color under possible moves
		if (possible_moves != null) {
			context.fillStyle = MOVE_SELECTIONS_CHECKER_PATTERN_COLOUR;
			for (let i=0; i< possible_moves.length; i++) {
				let move_option_pixel_coords = this.getPixelOffsetFromCheckerIndex(possible_moves[i]);
				context.fillRect(move_option_pixel_coords.x_offset, move_option_pixel_coords.y_offset, NUM_WIDTH_PIXELS_PER_CHECKER_BOX, NUM_HEIGHT_PIXELS_PER_CHECKER_BOX);
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
}

export = Board;