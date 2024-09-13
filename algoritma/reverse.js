function reverseAlphabet(str) {
	const alpha = str.replace(/\d/g, "");
	const num = str.replace(/\D/g, "");
	const reverse = alpha.split("").reverse().join("");

	return reverse + num;
}

const result = reverseAlphabet("NEGIE1");
console.log(result);
