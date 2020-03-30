class timeCalc {
	constructor(){
		var t = new Date()
		t.setHours(0, 0, 0, 0)
		this.t = t
		this.hours = this.t.getHours()
		this.minutes = t.getMinutes()
		this.seconds = t.getSeconds()
	}
	addHours(hours) {
		this.t.setHours( this.hours + hours);
		this.hours = this.t.getHours()
	}
	addMinutes(minutes) {
		this.t.setMinutes( this.minutes + minutes);
		this.minutes = this.t.getMinutes()
	}
	addSeconds(seconds) {
		this.t.setSeconds( this.seconds + seconds);
		this.seconds = this.t.getSeconds()
	}
	addTime(hours, minutes, seconds) {
		if ( hours ) this.addHours(hours)
		if ( minutes ) this.addMinutes(minutes)
		if ( seconds ) this.addSeconds(seconds)
	}
	addTimeArr(arr){
		if ( arr[0] ) this.addHours(arr[0])
		if ( arr[1] ) this.addMinutes(arr[1])
		if ( arr[2] ) this.addSeconds(arr[2])	
	}
	getTime(){
		return `${this.hours}:${this.minutes}:${this.seconds}`
	}
}