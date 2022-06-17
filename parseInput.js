function letterToNum(l) {
	return l.charCodeAt(0) - 64;
}

function readTextFile(file) {
	let allText = "";
	let rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function () {
		allText = rawFile.responseText;
	}
	rawFile.send(null);
	return allText;
}

const input = readTextFile("input.txt").split('\n');
const words = input[0].trim().split('|');

export const alphabet = input[1].trim();
export const wordData = [];
let index = 1;
for(let word of words){
	let [coStr, wordStr] = word.split(':');
	let [co1Str, co2Str] = coStr.split('.');
	
	function coStrToCo(coStr){
		let x = letterToNum(coStr[0]);
		let y = Number(coStr.substring(1));
		return [x, y];
	}

	let co1 = coStrToCo(co1Str);
	let co2 = coStrToCo(co2Str);

	wordData.push([wordStr, co1, co2, index]);
	index++;
}

