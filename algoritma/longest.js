function longest(sentence) {
	const word = sentence.split(" ");
	let longestWord = "";

	for (const words of word) {
		if (words.length > longestWord.length) {
			longestWord = words;
		}
	}

	return longestWord;
}

const sentence = "Saya sangat senang mengerjakan soal algoritma";
const result = longest(sentence);
console.log(result);
