const isDefined = (check) => (check !== undefined);

const tab = `\t`;
const line = `\n`;

(!String.prototype.insertStr) ?	
	String.prototype.insertStr = function(start, substr){ return this.slice(0, start) + substr + this.slice(start) }
	: console.log(`insertStr is used`);

(!String.prototype.indentAssocSrting) ?
	String.prototype.indentAssocSrting = function(){
		var str = this
		var tag = ``;
		var indent = true;
		for (let i = 0; i < str.length; i++){
			switch (str[i]) {
				case `,`:
					if (indent){
						str = str.insertStr(i + 1, line + tag) 
						i += tag.length + 1
					}
					break
				case `<`:
					tag += tab
					str = str.insertStr(i+1, line + tag)
					i += tag.length+1
					break
				case `>`:
					tag = (tag == tab) ? `` : tag.replace(new RegExp(tab+tab), tab)
					str = str.insertStr(i, "\n"+tag)
					i += tag.length+1
					break
				case `{`:
					if (i > 0) indent = (str[i-1] == `=`) ? true : false;
					break
				case `}`:
					indent = true
					break
				default:
					//do nothing
					break
			}
		}

		return str
	}
	: console.log(`indentAssocSrting is used`);

(!String.prototype.indentAssoc) ? 
	String.prototype.indentAssoc = function(action){
		console.log(`source: ` + line + this + line)
		var str = ``
		var time = isDefined(performance) ? performance.now() : 0
		switch (action) {
			case `assoc`: 
				str = this.trim().replace(/\n|\t/g,``).indentAssocSrting()
				break
			default:
				str = `Invalid action`
				console.log(str)
				break
		}
		time = isDefined(performance) ? performance.now() - time : 0
		console.log(`result: ` + line + str)
		console.log(`time: ` + time)
		return str
	} 
	: console.log(`indentAssoc is used`);