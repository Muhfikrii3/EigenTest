function matrixDiagonal(matrix) {
	const n = matrix.length;
	let first = 0;
	let second = 0;

	for (let i = 0; i < n; i++) {
		first += matrix[i][i];
		second += matrix[i][n - i - 1];
	}

	return Math.abs(first - second);
}

const matrix = [
	[1, 2, 0],
	[4, 5, 6],
	[7, 8, 9],
];
const result = matrixDiagonal(matrix);
console.log(result);
