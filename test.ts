function mouseDownA(event: MouseEvent): void {
   var x: number = event.x;
   var y: number = event.y;
   alert('x=' + x + ' y=' + y);
}

window.onload = () => {
		let canvas = <HTMLCanvasElement>document.createElement('canvas');
		canvas.width=1000;
		canvas.height=1000;
		canvas.addEventListener("mousedown", mouseDownA, false);
		document.body.appendChild(canvas);
		let ctx = canvas.getContext("2d");
		ctx.fillStyle = "rgb(100,100,100)";
		ctx.fillRect(0, 0, 400, 400);
};
