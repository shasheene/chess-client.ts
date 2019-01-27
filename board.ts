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

	convertStringToPiece(col: string, piece: string): string {
		// From UTF-16 decimal index 9812, there are a set of white pieces, which are an outline.
		// However, returning the internally filled black code points (from 9818) can be filled to
		// a color and look much much better.
		if (piece == "k") {
			// King
			return String.fromCharCode(9818);
		} else if (piece == "q") {
			// Queen
			return String.fromCharCode(9819);
		} else if (piece == "r") {
			// Rook
			return String.fromCharCode(9820);
		} else if (piece == "b") {
			// Bishop
			return String.fromCharCode(9821);
		} else if (piece == "h") {
			// Knight
			return String.fromCharCode(9822);
		} else if (piece == "p") {
			// Pawn
			return String.fromCharCode(9823);
		}
	}	

	/**
	 * Draws board checker pattern, and populates game pieces.
	 *
	 * @param selected_checker Coordinate of selected checker square
	 * @param possible_moves Array of moves that @param selected_checker can make
	 */
	drawBoard(selected_checker?: Coordinate, possible_moves?: Coordinate[]) {
		let game_state_message_string = '{"message_type": "GET_GAME_STATE", "payload": {"board": [["br", "bh", "bb", "bq", "bk", "bb", "bh", "br"], ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"], ["_", "_", "_", "_", "_", "_", "_", "_"], ["_", "_", "_", "_", "_", "_", "_", "_"], ["_", "_", "_", "_", "wp", "_", "_", "_"], ["_", "_", "_", "_", "_", "_", "_", "_"], ["wp", "wp", "wp", "wp", "_", "wp", "wp", "wp"], ["wr", "wh", "wb", "wq", "wk", "wb", "wh", "wr"]], "progress_state": {"description": "", "state": "INPROGRESS"}, "your_color": "white", "player_turn": "black"}}'
		let message = JSON.parse(game_state_message_string);
		let board = message.payload.board;

		let context = this.canvas.getContext("2d");
		if (context == null) {
			throw new Error("Context was null");
		}
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Loop over each checker square to draw the checker pattern
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
				context.font = "30px Arial"
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
				
		// Loop over each checker square to draw pieces
		for (let row_index = 0; row_index < BOARD_ROWS; row_index++) {
			for (let column_index = 0; column_index < BOARD_COLUMNS; column_index++) {
				let checker_index = {x_offset: column_index, y_offset: row_index};
				let checker_pixel_coord = this.getPixelOffsetFromCheckerIndex(checker_index);

				let piece_string = board[row_index][column_index];
				if (piece_string[0] == "w") {
					context.fillStyle = "white"
				} else {
					context.fillStyle = "black"
				}

				if (piece_string != "_") {
					context.textAlign = "center"
					let unicode_string = this.convertStringToPiece(piece_string[0], piece_string[1]);
					context.fillText(unicode_string, checker_pixel_coord.x_offset + NUM_WIDTH_PIXELS_PER_CHECKER_BOX/2,
						checker_pixel_coord.y_offset + (2*NUM_HEIGHT_PIXELS_PER_CHECKER_BOX)/3);
				}
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