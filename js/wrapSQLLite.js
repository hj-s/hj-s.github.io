const isDefined = (check) => (check !== undefined);
const isFeature = (check, property) => ( isDefined(check) ? check.hasOwnProperty(property) : false);

//const dhcomma = `"`;
const hcomma = `'`;
const tab = `\t`;
const line = `\n`;
const bslash = `\\`;
const space = ` `;
const plus = `+`;
const nt = ``;


var scomma, endLine, newLine;

//add tag to string
(!String.prototype.WrapTag) ? 
	String.prototype.WrapTag = function(tag) { return tag + this + tag } 
	: console.log(`WrapTag is used`);

//add single comma to string 
(!String.prototype.InComma) ? 
	String.prototype.InComma = function(){ return this.replace(new RegExp(scomma,`g`), scomma + scomma).WrapTag(scomma) } 
	: console.log(`InComma is used`);

(!String.prototype.surrondLite) ? 
	String.prototype.surrondLite = function(){ return this.replace(new RegExp(line,`g`), newLine) } 
	: console.log(`surrondLite is used`);

//init wrapper args
(!String.prototype.initWrap) ? 
	String.prototype.initWrap = function(args = undefined){
		//check args
		let backslash = false
		if (isDefined(args) && isFeature(args, `backslash`)) {
			backslash = args.backslash
		}
		//init 
		scomma = hcomma
		endLine = space + scomma + space + plus + (backslash ? space + bslash : nt)
		newLine = endLine + line + scomma
		return this
	} 
	: console.log(`initWrap is used`);


(!String.prototype.paseSqlString) ? 
	String.prototype.paseSqlString =  function(){
		let str = this.replace(/\n|\t/g,``)
		let sqlArray = str.split(' ')
		let sqlResult = []
		let newLine = '\n'
		let tabCounter = 0
		let tab = '\t'
		let join = false
		for (let i = 0; i < sqlArray.length; i++){
			switch (sqlArray[i]) {
				case "SELECT":
					if ( tabCounter == 0 ){
						sqlResult.push(sqlArray[i])
					}else{
						sqlResult.push(newLine + tab.repeat(tabCounter*2) + sqlArray[i])
					}
					break;
				case "FROM":
				case "WHERE":
				case "HAVING":
				case "ORDER":
				case "GROUP":
					sqlResult.push(newLine + tab.repeat(tabCounter*2) + sqlArray[i])
					break;
				case "INNER":
				case "LEFT":
				case "OUTER":
					sqlResult.push(newLine + tab.repeat(tabCounter*2) + sqlArray[i])
					join = true
					break;
				case "JOIN":
					if (join){
						sqlResult.push(sqlArray[i])
						join = false
						
					}else{
						sqlResult.push(newLine + tab.repeat(tabCounter*2) + sqlArray[i])
					}
					break;
				case "OR":
				case "AND":
				case "ON":
					sqlResult.push(newLine + tab.repeat(tabCounter*2+1) + sqlArray[i])
					break;
				case "(":
					sqlResult.push(sqlArray[i])
					tabCounter++
					break;
				case ")":
					tabCounter--
					sqlResult.push(newLine + tab.repeat(tabCounter*2+1) + sqlArray[i])
					break;
				default:
					sqlResult.push(sqlArray[i])
					break;
			}
		}
		return sqlResult.join(' ')
	}
	: console.log('paseSqlString is used');
//main function wrap
(!String.prototype.wrap) ? 
	String.prototype.wrap = function(action, args = undefined){
		console.log(`source: ` + line + this + line)
		var str = ''
		//var time = isDefined(performance) ? performance.now() : 0
		switch (action) {
			case `wrap`: 
				str = this.paseSqlString()
				break
			case `surround`:
				str = this.initWrap(args).trim()
						.InComma()
						.surrondLite()
				break
			default:
				str = `Invalid action`
				console.log(str)
				break
		}
		//time = isDefined(performance) ? performance.now() - time : 0
		console.log(`result: ` + line + str)
		//console.log(`time: ` + time)
		return str
	} 
	: console.log(`wrap is used`);


//let str = 'SELECT DISTINCT 	zc.PackageDataID, 	zce.main_contract_id, 	zce.contract_id, 	zce.unique_id AS unique_new, 	zce.number, 	zc.MajorVersion, 	zc.MinorVersion, 	zce.last_update_date, 	zc2.ContractDataID, 	zcd.unique_id AS unique_old, 	zc2.Number, 	zce2.last_update_date, 	zc2.MajorVersion, 	zc2.MinorVersion  FROM ZContrExport AS zce JOIN ZContracts AS zc 	ON zc.ContractDataID = zce.contract_id JOIN ZContracts AS zc2 	ON zc2.PackageDataID = zc.PackageDataID AND zc2.DocumentTypeDataID = zc.DocumentTypeDataID AND zc2.Number = zc.Number AND zc2.MainContractID <> zc2.ContractDataID JOIN zcat_contract_document AS zcd 	ON zcd.DataID = zc2.ContractDataID AND zcd.unique_id IS NOT NULL AND zcd.unique_id <> zce.unique_id JOIN ZContrExport AS zce2 	ON zce2.unique_id = zcd.unique_id WHERE zce.unique_id <> zce.main_contract_id  	AND zc.MajorVersion IN ( SELECT MAX(zcs.MajorVersion) 		FROM ZContracts AS zcs 		WHERE zcs.PackageDataID = zc.PackageDataID AND zcs.Number = zc.Number AND zcs.DocumentTypeDataID = zc.DocumentTypeDataID AND zcs.MinorVersion = AND zc.MajorVersion IN ( SELECT MAX(zcs.MajorVersion) 		FROM ZContracts AS zcs 		WHERE zcs.PackageDataID = zc.PackageDataID AND zcs.Number = zc.Number AND zcs.DocumentTypeDataID = zc.DocumentTypeDataID AND zcs.MinorVersion = 0 	)  	) AND zc.MajorVersion IN ( SELECT MAX(zcs.MajorVersion) 		FROM ZContracts AS zcs 		WHERE zcs.PackageDataID = zc.PackageDataID AND zcs.Number = zc.Number AND zcs.DocumentTypeDataID = zc.DocumentTypeDataID AND zcs.MinorVersion = 0 	) ORDER BY zc.MajorVersion ASC'


