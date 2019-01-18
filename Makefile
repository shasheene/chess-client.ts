all: board.ts constants.ts require.js
	tsc --strict --module amd constants.ts board.ts
