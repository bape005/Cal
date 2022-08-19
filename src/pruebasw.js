//var cadena = "[45645465] Canelo Gutierrez Cruz";
var cadena = "[BAME7804160000] EDGAR BLANCO MARTINEZ"
//console.log(cadena)
let pa = new RegExp("[A-Z0-9]");
var rg = /\[(.*?)\]/g;
var y = cadena.matchAll(rg);
var r = Array.from(y);
var rr = r[0];
x = cadena.replace(rr[0] + " ", "")
console.log(x)
console.log(rr[0]);
//console.log(pa)
//console.log(cadena)