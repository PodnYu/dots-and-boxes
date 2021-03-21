export default function range(start, end) {
	const length = end + 1 - start;

	return Array.from({ length }, (_, i) => start + i);
}
