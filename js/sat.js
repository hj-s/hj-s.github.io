//arrow functions
const isDefined = (check) => (check !== undefined)
//const round = (x) =>  (Math.round(x * 1000) / 1000)
const fuzzCheck = (a,b, c = 0.1) => (Math.abs(a - b) <= c)

function init(){

	Global.initglobal()

	requestAnimationFrame(drawLoop)
}

// animation loop
function drawLoop(){
	requestAnimationFrame(drawLoop)
  	draw()
}

//main draw
function draw(){
	Global.ctx.clearCtx(Global.mainCanvas)

	Global.ctx.fillBackground(Global.mainCanvas)


	handleSpacebar(Global.mainCanvas)
	handlePoint(Global.mainCanvas)
	handleBullets(Global.mainCanvas)
	handleBulletFractions(Global.mainCanvas)
}

function handleSpacebar(id){
	let ctx = Global.ctx.getCtx(id)
	if ( Global.spacebar && !Global.bulletTimer ){
		Global.spacebar = false

		if ( ( Global.upM && Global.downM ) || ( Global.rightM && Global.leftM ) || 
			( !Global.upM && !Global.downM && !Global.rightM && !Global.leftM && !Global.point.upML && !Global.point.downML && !Global.point.rightML && !Global.point.leftML  ) ){
			return false
		}
		let bullet = undefined
		if ( Global.point ){
			bullet = new BulletPoint(Global.point.x, Global.point.y)
		}else{
			bullet = new BulletPoint(Global.startPointX, Global.startPointY)
		}
		bullet.upM = Global.upM || Global.point.upML
		bullet.downM = Global.downM || Global.point.downML
		bullet.rightM = Global.rightM || Global.point.rightML
		bullet.leftM = Global.leftM || Global.point.leftML
		bullet.fired = true
		Global.bullet.push(bullet)
		bullet.render(ctx)
		Global.bulletTimer = setTimeout(Global.resetBulletTimer, 100)
	}
}
function handleBullets(id){
	let ctx = Global.ctx.getCtx(id)
	if (Global.bullet && Global.bullet.length){
		for ( let i = 0; i < Global.bullet.length; i++ ){
			if ( Global.bullet[i] ){
				let nextPoint = Global.bullet[i].checkMove()
				Global.bullet[i].moveToPoint(nextPoint)
				if ( nextPoint.x >= ctx.canvas.width || nextPoint.x <= 0 || nextPoint.y >= ctx.canvas.height || nextPoint.y <= 0 ){
					createBulletFraction(id, Global.bullet[i])
					Global.bullet[i] = undefined
				}else{
					Global.bullet[i].render(ctx)
				}
			}
		}
	}
}
function createBulletFraction(id, point){
	let ctx = Global.ctx.getCtx(id)

	let fraction = undefined

	if ( point.x <= 0 ){
		if ( !point.downM ){
			fraction = new BulletFraction(1, point.y)
			fraction.upM = true
			fraction.downM = false
			fraction.rightM = false
			fraction.leftM = false
			Global.fractions.push(fraction)

			fraction = new BulletFraction(1, point.y)
			fraction.upM = true
			fraction.downM = false
			fraction.rightM = true
			fraction.leftM = false
			Global.fractions.push(fraction)
		}
		if ( !point.upM ){
			fraction = new BulletFraction(1, point.y)
			fraction.upM = false
			fraction.downM = true
			fraction.rightM = false
			fraction.leftM = false
			Global.fractions.push(fraction)

			fraction = new BulletFraction(1, point.y)
			fraction.upM = false
			fraction.downM = true
			fraction.rightM = true
			fraction.leftM = false
			Global.fractions.push(fraction)
		}

	}
	if ( point.x >= ctx.canvas.width ){
		if ( !point.downM ){
			fraction = new BulletFraction(ctx.canvas.width - 1, point.y)
			fraction.upM = true
			fraction.downM = false
			fraction.rightM = false
			fraction.leftM = false
			Global.fractions.push(fraction)

			fraction = new BulletFraction(ctx.canvas.width - 1, point.y)
			fraction.upM = true
			fraction.downM = false
			fraction.rightM = false
			fraction.leftM = true
			Global.fractions.push(fraction)
		}

		if ( !point.upM ){
			fraction = new BulletFraction(ctx.canvas.width - 1, point.y)
			fraction.upM = false
			fraction.downM = true
			fraction.rightM = false
			fraction.leftM = false
			Global.fractions.push(fraction)

			fraction = new BulletFraction(ctx.canvas.width - 1, point.y)
			fraction.upM = false
			fraction.downM = true
			fraction.rightM = false
			fraction.leftM = true
			Global.fractions.push(fraction)
		}
	}
	if ( point.y <= 0 ){
		if ( !point.leftM ) {
			fraction = new BulletFraction(point.x, 1)
			fraction.upM = false
			fraction.downM = false
			fraction.rightM = true
			fraction.leftM = false
			Global.fractions.push(fraction)

			fraction = new BulletFraction(point.x, 1)
			fraction.upM = false
			fraction.downM = true
			fraction.rightM = true
			fraction.leftM = false
			Global.fractions.push(fraction)
		}
		if ( !point.rightM ){
			fraction = new BulletFraction(point.x, 1)
			fraction.upM = false
			fraction.downM = false
			fraction.rightM = false
			fraction.leftM = true
			Global.fractions.push(fraction)

			fraction = new BulletFraction(point.x, 1)
			fraction.upM = false
			fraction.downM = true
			fraction.rightM = false
			fraction.leftM = true
			Global.fractions.push(fraction)
		}
	}
	if ( point.y >= ctx.canvas.height ){
		if ( !point.leftM ) {
			fraction = new BulletFraction(point.x, ctx.canvas.height - 1)
			fraction.upM = false
			fraction.downM = false
			fraction.rightM = true
			fraction.leftM = false
			Global.fractions.push(fraction)

			fraction = new BulletFraction(point.x, ctx.canvas.height - 1)
			fraction.upM = true
			fraction.downM = false
			fraction.rightM = true
			fraction.leftM = false
			Global.fractions.push(fraction)
		}

		if ( !point.rightM ){
			fraction = new BulletFraction(point.x, ctx.canvas.height - 1)
			fraction.upM = false
			fraction.downM = false
			fraction.rightM = false
			fraction.leftM = true
			Global.fractions.push(fraction)

			fraction = new BulletFraction(point.x, ctx.canvas.height - 1)
			fraction.upM = true
			fraction.downM = false
			fraction.rightM = false
			fraction.leftM = true
			Global.fractions.push(fraction)
		}
	}
}
function handleBulletFractions(id){
	let ctx = Global.ctx.getCtx(id)

	if ( Global.fractions && Global.fractions.length){
		for ( let i = 0; i < Global.fractions.length; i++ ){
			if ( Global.fractions[i] && Global.fractions[i].life > 0 ){
				let nextPoint = Global.fractions[i].checkMove()
				if ( nextPoint.x >= ctx.canvas.width || nextPoint.x <= 0 || nextPoint.y >= ctx.canvas.height || nextPoint.y <= 0 ){
					Global.fractions[i] = undefined
				} else {
					Global.fractions[i].moveToPoint(nextPoint)
					Global.fractions[i].render(ctx)
				}
			}else{
				Global.fractions[i] = undefined
			}
		}
	}
	Global.fractions = Global.fractions.filter(x => x)
}
function handlePoint(id){
	let ctx = Global.ctx.getCtx(id)

	if ( Global.point ){
		let nextMove = Global.point.checkMove()
		if ( nextMove.x >= ctx.canvas.width - 1 || nextMove.x <= 1 || nextMove.y >= ctx.canvas.height - 1 || nextMove.y <= 1 ){
			Global.point.render(ctx)
		} else {
			Global.point.moveToPoint(nextMove)
			Global.point.render(ctx)
		}
	}
}

//class {
	class Global {
		constructor(){}
		static initglobal(){
			
			Global.initListeners()

			Global.upM = false
			Global.downM = false
			Global.rightM = false
			Global.leftM = false
			Global.spacebar = false
			Global.bullet = []
			Global.bulletTimer = undefined
			Global.fractions = []

			Global.mainCanvas = 'sfield'

			let innerWidth = 640
			let innerHeight = 480

			let pageWidth = document.documentElement.clientWidth
			let pageHeight = document.documentElement.clientHeight

			Global.widthD = pageWidth/innerWidth
			Global.heightD = pageHeight/innerHeight

			Global.startPointX = pageWidth/2
			Global.startPointY = pageHeight/2

			Global.ctx = new ContextHandler(pageWidth, pageHeight, Global.mainCanvas)

			Global.initPoint()

		}
		static initListeners(){
			if (isDefined(document)) {
				document.addEventListener(`keydown`, this.handleKeysDown)
				document.addEventListener(`keyup`, this.handleKeysUp)
			}
		}

		//handle keys
		static handleKeysDown(event){
			//check what keys are down
			if (event.key == `W` || event.key == `w` || event.keyCode == 119 || event.keyCode == 87 || event.keyCode == 38) { //w
				Global.upM = true
			}
			if (event.key == `S` || event.key == `s` || event.keyCode == 115 || event.keyCode == 83 || event.keyCode == 40) { //s
				Global.downM = true
			}
			if (event.key == `A` || event.key == `a` || event.keyCode == 97 || event.keyCode == 65 || event.keyCode == 37) { //a
				Global.leftM = true
			}
			if (event.key == `D` || event.key == `d` || event.keyCode == 100 || event.keyCode == 68 || event.keyCode == 39) { //d
				Global.rightM = true
			}
			if (event.keyCode == 32 ){
				Global.spacebar = true
			}
		}
		//handle keys
		static handleKeysUp(event){
			//checm what keys are UP
			if (event.key == `W` || event.key == `w` || event.keyCode == 119 || event.keyCode == 87 || event.keyCode == 38) { //w
				Global.upM =  false
			}
			if (event.key == `S` || event.key == `s` || event.keyCode == 115 || event.keyCode == 83 || event.keyCode == 40) { //s
				Global.downM = false
			}
			if (event.key == `A` || event.key == `a` || event.keyCode == 97 || event.keyCode == 65 || event.keyCode == 37) { //a
				Global.leftM = false
			}
			if (event.key == `D` || event.key == `d` || event.keyCode == 100 || event.keyCode == 68 || event.keyCode == 39) { //d
				Global.rightM = false
			}
			if (event.keyCode == 32 ){
				Global.spacebar = false
			}
		}
		static forDebug(){

		}
		static resetBulletTimer(){
			if ( Global.bulletTimer ){
				clearTimeout(Global.bulletTimer)
				Global.bulletTimer = undefined
			}
		}
		static initPoint(){
			Global.point = new UserPoint(Global.startPointX, Global.startPointY)	
		}
	}
	class ContextHandler {
		constructor(width, height, ...rest){	
			for (let i = 0; i < rest.length; i++){
				this[rest[i]] = this.initCtx(rest[i], width, height)
				if (!isDefined(this[rest[i]])){
					this[rest[i]].restore()
				}
			}
		}
		initCtx(id, width, height){
			let canvas = document.getElementById(id)
			if (isDefined(canvas)){
				canvas.height = height
				canvas.width = width
				if (canvas.getContext){
					let ctx  = canvas.getContext(`2d`, { alpha: false })
					ctx.beginPath()
					ctx.globalAlpha = 1
					ctx.lineCap = `round`
					ctx.lineJoin = `round`
					ctx.lineWidth = 2
					ctx.globalCompositeOperation = `source-over`
					ctx.save()				
					return ctx
				}else{
					return undefined
				}
			}else {
				return undefined
			}		
		}
		getCtx(id){
			if (isDefined(this[id])){
				this[id].restore()
				this[id].beginPath()
			}
			return this[id]
		}
		clearCtx(id){
			let ctx = this[id]
			if (isDefined(ctx)){
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height) 
				ctx.closePath()
			}			
		}
		fillBackground(id){
			let ctx = this[id]
			if ( isDefined(ctx) ){
				// Draw yellow background
				ctx.beginPath();
				ctx.fillStyle = '#ff6';
				ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.closePath()
			}
		}
	}

	class Point {
		constructor(x = 0, y = 0){
			this.x = x
			this.y = y
			this.upM = false
			this.downM = false
			this.rightM = false
			this.leftM = false
			this.speed = 1 * Global.widthD
			this.width = 6 * Global.widthD
			this.height = 6 * Global.widthD
		}
		move(){

		}
		moveTo(x, y){
			this.x = x
			this.y = y
			//for move eventx
			this.move()
		}
		moveToPoint(point){
			if (isDefined(point)){
				this.moveTo(point.x, point.y)
			}
		}
		checkMove(){
			let newX = this.x
			let newY = this.y
			let deltaX = 0
			let deltaY = 0
			if ( Global.upM && !Global.downM ){
				deltaY -= this.speed
			}
			if ( Global.downM && !Global.upM ){
				deltaY += this.speed
			}
			if ( Global.rightM && !Global.leftM ){
				deltaX += this.speed
			}
			if ( Global.leftM && !Global.rightM ){
				deltaX -= this.speed
			}
			if ( deltaY != 0 && deltaX != 0 ){
				deltaX = deltaX/Math.abs(deltaX) * this.speed * ( 1/Math.sqrt(2) ) 
				deltaY = deltaY/Math.abs(deltaY) * this.speed * ( 1/Math.sqrt(2) ) 
			}
			newX += deltaX
			newY += deltaY

			return new Point(newX, newY)
		}
		render(ctx){
			ctx.fillStyle = `black` 
			ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
			ctx.closePath()
			ctx.fill()
		}
	}

	class UserPoint extends Point{
		constructor(x = 0, y = 0){
			super(x,y)
			this.upML = false
			this.downML = false
			this.rightML = false
			this.leftML = false
		}
		checkMove(){
			let newX = this.x
			let newY = this.y
			let deltaX = 0
			let deltaY = 0
			if ( Global.upM && !Global.downM ){
				deltaY -= this.speed
				this.upML = true
				this.downML = false
				this.rightML = false
				this.leftML = false
			}
			if ( Global.downM && !Global.upM ){
				deltaY += this.speed
				this.upML = false
				this.downML = true
				this.rightML = false
				this.leftML = false
			}
			if ( Global.rightM && !Global.leftM ){
				deltaX += this.speed
				this.upML = false
				this.downML = false
				this.rightML = true
				this.leftML = false
			}
			if ( Global.leftM && !Global.rightM ){
				deltaX -= this.speed
				this.upML = false
				this.downML = false
				this.rightML = false
				this.leftML = true
			}
			if ( deltaY != 0 && deltaX != 0 ){
				deltaX = deltaX/Math.abs(deltaX) * this.speed * ( 1/Math.sqrt(2) ) 
				deltaY = deltaY/Math.abs(deltaY) * this.speed * ( 1/Math.sqrt(2) ) 
				this.upML = false
				this.downML = false
				this.rightML = false
				this.leftML = false
			}
			newX += deltaX
			newY += deltaY

			return new Point(newX, newY)
		}
	}

	class BulletPoint extends Point{
		constructor(x = 0, y = 0){
			super(x ,y)
			this.fired = false
			this.speed = 6 * Global.widthD 
			this.width = 4 * Global.widthD 
			this.height = 4 * Global.widthD 
		}
		render(ctx){
			ctx.fillStyle = `red` 
			ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
			ctx.closePath()
			ctx.fill()
		}
		checkMove(){
			let newX = this.x
			let newY = this.y
			let deltaX = 0
			let deltaY = 0
			if ( this.upM && !this.downM ){
				deltaY -= this.speed
			}
			if ( this.downM && !this.upM ){
				deltaY += this.speed
			}
			if ( this.rightM && !this.leftM ){
				deltaX += this.speed
			}
			if ( this.leftM && !this.rightM ){
				deltaX -= this.speed
			}
			if ( deltaY != 0 && deltaX != 0 ){
				deltaX = deltaX/Math.abs(deltaX) * this.speed * ( 1/Math.sqrt(2) ) 
				deltaY = deltaY/Math.abs(deltaY) * this.speed * ( 1/Math.sqrt(2) ) 
			}
			newX += deltaX
			newY += deltaY

			return new Point(newX, newY)
		}
	}
	class BulletFraction extends BulletPoint{
		constructor(x = 0, y = 0){
			super(x, y)
			this.fired = true
			this.life = 14
			this.speed = 2 * Global.widthD 
			this.width=  2 * Global.widthD 
			this.height = 2 * Global.widthD 
		}
		render(ctx){
			ctx.fillStyle = `red` 
			ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
			ctx.closePath()
			ctx.fill()
		}
		move(){
			this.life--
		}
	}
//}