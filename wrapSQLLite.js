const isDefined = (check) => (check !== undefined);
const isFeature = (check, property) => ( isDefined(check) ? check.hasOwnProperty(property) : false);

const dhcomma = `"`;
const hcomma = `'`;
const tab = `\t`;
const line = `\n`;
const bslash = `\\`;
const space = ` `;
const plus = `+`;
const nt = ``;
const keywordsSingle = [`from `, `order by `, `where `, `inner join `, `outer join `, `left join `,`group by `];
const keyrowdsMany = [ ` on `, ` and `, ` or `];

var scomma, endLine, newLine;

//add tag to string
// if (!String.prototype.WrapTag){String.prototype.WrapTag = function(tag){
// 		return tag + this + tag
// 	};
// }
(!String.prototype.WrapTag) ? String.prototype.WrapTag = function(tag){ return tag + this + tag;} : console.log(`WrapTag is used`);

//add single comma to string 
// if (!String.prototype.InComma){String.prototype.InComma = function(){
// 		return this.replace(/'/g, hcomma + hcomma)
// 				.WrapTag(hcomma)
// 	};
// }
(!String.prototype.InComma) ? String.prototype.InComma = function(){ return this.replace(new RegExp(scomma,`g`), scomma + scomma).WrapTag(scomma)} : console.log(`InComma is used`);

// if (!String.prototype.surrondLite){String.prototype.surrondLite = function(){
// 		return this.replace(new RegExp(line,`g`), newLine )
// 	};
// }
(!String.prototype.surrondLite) ? String.prototype.surrondLite = function(){ return this.replace(new RegExp(line,`g`), newLine )} : console.log(`surrondLite is used`);

// wrap keyword
// if (!String.prototype.wrapKeywordLite){String.prototype.wrapKeywordLite = function(keyword, wrapper){
// 		return this.replace(new RegExp(keyword,`g`), wrapper+keyword)
// 	}
// }
(!String.prototype.wrapKeywordLite) ? String.prototype.wrapKeywordLite = function(keyword, wrapper){ return this.replace(new RegExp(keyword,`g`), wrapper+keyword)} : console.log(`wrapKeywordLite is used`);

//wrap array of keywords
// if (!String.prototype.handleArrayLite){String.prototype.handleArrayLite = function(keywords, wrapper){
// 		var strSQL = this;
// 		for (keyword in keywords){
// 			strSQL = strSQL.wrapKeywordLite(keywords[keyword], wrapper);
// 		}
// 		return strSQL
// 	};
// }
(!String.prototype.handleArrayLite) ? String.prototype.handleArrayLite = function(keywords, wrapper){
	var strSQL = this;
	for (keyword in keywords){
		strSQL = strSQL.wrapKeywordLite(keywords[keyword], wrapper);
	}
	return strSQL
} : console.log(`wrapKeywordLite is used`);

//wrap lines
// if (!String.prototype.handleLines){String.prototype.handleLines = function(){
// 		return this.handleArrayLite(keywordsSingle,  newLine)
// 				.handleArrayLite(keyrowdsMany, newLine + tab)
// 	};
// }
(!String.prototype.handleLines) ? String.prototype.handleLines = function(){ return this.handleArrayLite(keywordsSingle,  newLine).handleArrayLite(keyrowdsMany, newLine + tab)} : console.log(`handleLines is used`);

//wrap SQL request
// if (!String.prototype.handleSQL){String.prototype.handleSQL = function(){
// 		return this.replace(/\n|\t/g,``)
// 				.replace(/ , |, | ,/g, `,`)
// 				.handleLines()
// 	};
// }
(!String.prototype.handleSQL) ? String.prototype.handleSQL = function(){ return this.replace(/\n|\t/g,``).replace(/ , |, | ,/g, `,`).handleLines()} : console.log(`handleSQL is used`);

//surround lines like `\n` -> ` ' + \\ \n'`
// if (!String.prototype.surroundLinesWith){String.prototype.surroundLinesWith = function(){
// 		return this.surroundWith(line, endLine, hcomma)
// 	};
//}
(!String.prototype.surroundLinesWith) ? String.prototype.surroundLinesWith = function(){ return this.surroundWith(line, endLine, scomma)} : console.log(`surroundLinesWith is used`);

//init wrapper args
(!String.prototype.initWrap) ? String.prototype.initWrap = function(args = undefined){
	//check args
	let backslash = false;
	if (isDefined(args) && isFeature(args, `backslash`)) {
		backslash = args.backslash;
	}

	//init 
	scomma = hcomma;
	endLine = space + scomma + space + plus + (backslash ? space + bslash : nt);
	newLine = endLine + line + scomma;
	return this;
} : console.log(`initWrap is used`);

//main function wrap
(!String.prototype.wrap) ? String.prototype.wrap = function(action, args = undefined){
	console.log(`source: ` + line + this + line);	
	var str = ``;
	switch (action) {
		case `wrap`: 
			str = this.initWrap(args).trim()
					.InComma()
					.handleSQL();
			break;
		case `surround`:
			str = this.initWrap(args).trim()
					.InComma()
					.surrondLite();
			break;
		default:
			str = `Invalid action`;
			console.log(str);
			break;
	}
	console.log(`result: ` + line + str);
	return str
} : console.log(`wrap is used`);