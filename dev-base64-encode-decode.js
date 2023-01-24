/**
 * JavaScript Encode and Decode Utility Should run this NodeJS script to convert
 * the configurations from dev-config.json into an encoded string which the
 * application will use.
 */
var fs = require('fs');
var configurations = require('./dev-config.json');

console.log('Configurations' + JSON.stringify(configurations));

var encodeString = b64EncodeUnicode(JSON.stringify(configurations));
console.log('encoded string' + encodeString);

var decodeString = b64DecodeUnicode(encodeString);
console.log('decoded string' + decodeString);

var fileLocation = "./application.js";
fs.writeFile(fileLocation, encodeString, function(err) {
	if (err) {
		return console.log("Error while saving the encoded string in file" + err);
	}
	console.log("Encoded configuration saved at " + fileLocation);
});

/**
 * To encode the string into a Base64-encoded value back
 * 
 * @param str
 * @returns encoded string
 */
function b64EncodeUnicode(str) {
	// first we use encodeURIComponent to get percent-encoded UTF-8, then we
	// convert the percent encodings into raw bytes which can be fed into btoa.
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
		return String.fromCharCode('0x' + p1);
	}));
}

/**
 * To decode the Base64-encoded value back into a String
 * 
 * @param str
 * @returns decoded string
 */
function b64DecodeUnicode(str) {
	return decodeURIComponent(atob(str).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
}

// Using Buffer to replicate the browser functions, atab and btoa
function btoa(str) {
	return Buffer.from(str).toString('base64');
}

function atob(b64Encoded) {
	return Buffer.from(b64Encoded, 'base64').toString();
}