export const CANVAS_WIDTH=400;
export const CANVAS_HEIGHT=400;

export const BOARD_ROWS=8;
export const BOARD_COLUMNS=8;

export const NUM_WIDTH_PIXELS_PER_CHECKER_BOX = CANVAS_WIDTH/BOARD_COLUMNS;
export const NUM_HEIGHT_PIXELS_PER_CHECKER_BOX = CANVAS_HEIGHT/BOARD_ROWS;

export const DARK_CHECKER_PATTERN_COLOUR="rgb(75,75,75)";
export const LIGHT_CHECKER_PATTERN_COLOUR="rgb(200,200,200)";

export const SELECTED_PIECE_CHECKER_PATTERN_COLOUR="rgb(255,165,0)";
export const MOVE_SELECTIONS_CHECKER_PATTERN_COLOUR="rgb(255,255,0)";

export type Coordinate = {x_offset: number, y_offset: number};
