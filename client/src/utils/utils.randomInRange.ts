export default function randomInRange(start: number, end: number) {
  return Math.round(Math.random() * (end - start) + start)
}
