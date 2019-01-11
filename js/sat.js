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
	handleTargets(Global.mainCanvas)
}

function handleSpacebar(id){
	let ctx = Global.ctx.getCtx(id)
	if ( ctx ){
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
			bullet.setMove( Global.upM || Global.point.upML,  Global.downM || Global.point.downML, Global.rightM || Global.point.rightML, Global.leftM || Global.point.leftML )
			bullet.fired = true
			bullet.render(ctx)
			Global.bullet.push(bullet)
			Global.bulletTimer = setTimeout(Global.resetBulletTimer, 100)
		}
	}
}
function handleBullets(id){
	if (Global.bullet && Global.bullet.length){
		for ( let i = 0; i < Global.bullet.length; i++ ){
			if ( Global.bullet[i] ){
				if ( !Global.bullet[i].checkCollision(id) ){
					Global.bullet[i] = undefined
				}
			}
		}
	}
	Global.bullet = Global.bullet.filter(x => x)
}
function handleBulletFractions(id){
	if ( Global.fractions && Global.fractions.length){
		for ( let i = 0; i < Global.fractions.length; i++ ){
			if ( !( Global.fractions[i] && Global.fractions[i].life > 0 && Global.fractions[i].checkColisson(id) ) ){
				Global.fractions[i] = undefined
			}
		}
	}
	Global.fractions = Global.fractions.filter(x => x)
}
function handlePoint(id){
	if ( Global.point ){
		Global.point.handleMovement(id)
	}
}
function handleTargets(id){
	let ctx = Global.ctx.getCtx(id)
	if ( ctx ){
		if ( Global.targets && Global.targets.length ){
			for (let i = 0; i < Global.targets.length; i++ ){
				if ( Global.targets[i] ){
					Global.targets[i].render(ctx)
				}
			}
		}
	}

	Global.targets = Global.targets.filter(x => x)
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
			Global.targets = []

			Global.mainCanvas = 'sfield'

			let innerWidth = 640
			let innerHeight = 480

			let pageWidth = document.documentElement.clientWidth
			Global.pageWidth = pageWidth
			let pageHeight = document.documentElement.clientHeight
			Global.pageHeight = pageHeight

			Global.widthD = pageWidth/innerWidth
			Global.heightD = pageHeight/innerHeight

			Global.startPointX = pageWidth/2
			Global.startPointY = pageHeight/2

			Global.ctx = new ContextHandler(pageWidth, pageHeight, Global.mainCanvas)

			Global.initPoint()
			Global.createTargets()

		}
		static initListeners(){
			if ( document ) {
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
		static pushFraction(fraction){
			if ( Global.fractions ){
				Global.fractions.push(fraction)
			}
		}
		static generatePoint(){
			let point = new Point(Math.floor( Math.random() * this.pageWidth), Math.floor( Math.random() * this.pageHeight))
			if ( Global.point ){
				if ( point.checkCollisionWith(Global.point) ){
					return this.generatePoint()
				}
			}
			if ( Global.targets && Global.targets.length > 0 ){
				let counter = 0
				let collision = false
				for (let i = 0; i < Global.targets.length; i++ ){
					if ( Global.targets[i] ){
						if ( point.checkCollisionWith( Global.targets[i] ) ) {
							counter++
							collision = true
						}
					}
				}
				if ( collision & counter == Global.targets.length  ){
					return false
				}else if ( collision ){
					return this.generatePoint()
				}
			}
			return point
		}
		static createTargets(count = 1){
			for (let i = 0; i < count; i++){
				let target = new Target()
				let targetPoint = this.generatePoint()
				if (targetPoint){
					target.moveToPoint(targetPoint)
					Global.targets.push(target)
				}
			}
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
			if ( canvas ){
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
			if ( ctx ){
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height) 
				ctx.closePath()
			}			
		}
		fillBackground(id){
			let ctx = this[id]
			if ( ctx ){
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
			//for move events
			this.move()
		}
		moveToPoint(point){
			if ( point ){
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

			//return new Point(newX, newY)
			return this.copy(newX, newY)
		}
		render(ctx){
			if ( ctx ){
				ctx.fillStyle = `black` 
				ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
				ctx.closePath()
				ctx.fill()
			}
		}
		setMove(upM, downM, rightM, leftM){
			this.upM = upM
			this.downM = downM
			this.rightM = rightM
			this.leftM = leftM
		}
		is(point){
			return (this.x == point.x && this.y == point.y)
		}
		checkCollisionWith(point){
			if ( point ){
				if ( this.is(point) ){
					return true
				}
				if (( this.x >= point.x - point.width/2 - this.width/2 && this.x <= point.x + point.width/2 + this.width/2 ) &&
					( this.y >= point.y - point.height/2 - this.height/2 && this.y <= point.y + point.width/2 + this.height/2 )
				){
					return true
				}
			}
			return false
		}
		copy(x, y){
			let pointCopy = new Point( x || this.x, y || this.y)
			pointCopy.speed = this.speed
			pointCopy.width = this.width
			pointCopy.height = this.height
			return pointCopy
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
		checkTargetBorder(nextPoint){
			if ( Global.targets && Global.targets.length ){
				for (let i = 0; i < Global.targets.length; i++ ){
					if ( Global.targets[i] ){
						if ( nextPoint.checkCollisionWith( Global.targets[i] ) ){
							return Global.targets[i].copy()
						}
					}
				}
			}
			return false
		}
		handleMovement(id){
			let ctx = Global.ctx.getCtx(id)
			if ( ctx ){
				let nextMove = this.checkMove()
				if ( nextMove.x >= ctx.canvas.width - 1 || nextMove.x <= 1 || nextMove.y >= ctx.canvas.height - 1 || nextMove.y <= 1 ){
					this.render(ctx)
				} else {
					let checkTargets = this.checkTargetBorder(nextMove)
					if ( checkTargets ){
						console.log('collision with target')
						Global.initglobal()
					}else{
						this.moveToPoint(nextMove)
					}
					this.render(ctx)
				}
			}
		}
	}
	class Target extends Point{
		constructor(x = 0, y = 0){
			super(x ,y)
			this.speed = 6 * Global.widthD 
			this.width = 10 * Global.widthD 
			this.height = 10 * Global.widthD 
		}
		render(ctx){
			if ( ctx ){
				ctx.fillStyle = `gray` 
				ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
				ctx.closePath()
				ctx.fill()
			}
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
			if ( ctx ){
				ctx.fillStyle = `red` 
				ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
				ctx.closePath()
				ctx.fill()
			}
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
		checkCollision(id){
			let ctx = Global.ctx.getCtx(id)
			if ( ctx ){
				let nextPoint = this.checkMove()
				this.moveToPoint(nextPoint)
				let border = this.checkCanvasBorder(ctx, nextPoint)
				if ( border ){
					this.createBulletFraction(id, border)
					Global.createTargets(3)
				 	return false
				}
				let target = this.checkTargetBorder(nextPoint)
				if ( target ){
					this.createBulletFraction(id, target)
				 	return false
				}
				this.render(ctx)
			}
			return true	
		}
		checkCanvasBorder(ctx, nextPoint){
			if ( nextPoint.x >= ctx.canvas.width ){
				return new Point(ctx.canvas.width-1, nextPoint.y)
			}else if ( nextPoint.x <= 0 ) {
				return new Point(1, nextPoint.y)
			}else if ( nextPoint.y >= ctx.canvas.height  ) {
				return new Point(nextPoint.x, ctx.canvas.height-1)
			}else if ( nextPoint.y <= 0  ) {
				return new Point(nextPoint.x, 1)
			}else{
				return false
			}	
		}
		checkTargetBorder(nextPoint){
			if ( Global.targets && Global.targets.length ){
				for (let i = 0; i < Global.targets.length; i++ ){
					if ( Global.targets[i] ){
						if ( nextPoint.checkCollisionWith( Global.targets[i] ) ) {
							let tempTarget = Global.targets[i].copy()
							Global.createTargets(2)
							Global.targets[i] = undefined
							return tempTarget
						}
					}
				}
			}
			return false
		}
		createBulletFraction(id, point){
			let fraction = undefined

			if ( !this.downM ){
				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = true
				fraction.downM = false
				fraction.rightM = false
				fraction.leftM = false
				Global.pushFraction(fraction)

				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = true
				fraction.downM = false
				fraction.rightM = true
				fraction.leftM = false
				Global.pushFraction(fraction)
			}
			if ( !this.upM ){
				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = false
				fraction.downM = true
				fraction.rightM = false
				fraction.leftM = false
				Global.pushFraction(fraction)

				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = false
				fraction.downM = true
				fraction.rightM = true
				fraction.leftM = false
				Global.pushFraction(fraction)
			}

			if ( !this.downM ){
				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = true
				fraction.downM = false
				fraction.rightM = false
				fraction.leftM = false
				Global.pushFraction(fraction)

				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = true
				fraction.downM = false
				fraction.rightM = false
				fraction.leftM = true
				Global.pushFraction(fraction)
			}

			if ( !this.upM ){
				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = false
				fraction.downM = true
				fraction.rightM = false
				fraction.leftM = false
				Global.pushFraction(fraction)

				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = false
				fraction.downM = true
				fraction.rightM = false
				fraction.leftM = true
				Global.pushFraction(fraction)
			}
			if ( !this.leftM ) {
				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = false
				fraction.downM = false
				fraction.rightM = true
				fraction.leftM = false
				Global.pushFraction(fraction)

				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = false
				fraction.downM = true
				fraction.rightM = true
				fraction.leftM = false
				Global.pushFraction(fraction)
			}
			if ( !this.rightM ){
				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = false
				fraction.downM = false
				fraction.rightM = false
				fraction.leftM = true
				Global.pushFraction(fraction)

				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = false
				fraction.downM = true
				fraction.rightM = false
				fraction.leftM = true
				Global.pushFraction(fraction)
			}
			if ( !this.leftM ) {
				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = false
				fraction.downM = false
				fraction.rightM = true
				fraction.leftM = false
				Global.pushFraction(fraction)

				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = true
				fraction.downM = false
				fraction.rightM = true
				fraction.leftM = false
				Global.pushFraction(fraction)
			}

			if ( !this.rightM ){
				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = false
				fraction.downM = false
				fraction.rightM = false
				fraction.leftM = true
				Global.pushFraction(fraction)

				fraction = new BulletFraction(point.x, point.y)
				fraction.upM = true
				fraction.downM = false
				fraction.rightM = false
				fraction.leftM = true
				Global.pushFraction(fraction)
			}
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
			if ( ctx ){
				ctx.fillStyle = `red` 
				ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
				ctx.closePath()
				ctx.fill()
			}
		}
		move(){
			this.life--
		}
		checkColisson(id){
			let ctx = Global.ctx.getCtx(id)
			if ( ctx ){
				let nextPoint = this.checkMove()
				let border =  this.checkCanvasBorder(ctx, nextPoint)
				if ( border ){
					return false
				}else {
					this.moveToPoint(nextPoint)
					this.render(ctx)
					return true
				}
			}
		}
	}
//}