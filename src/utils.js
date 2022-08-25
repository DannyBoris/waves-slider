export function roundToNearest(numToRound, numToRoundTo) {
  numToRoundTo = 1 / numToRoundTo;
  return Math.round(Math.round(numToRound * numToRoundTo) / numToRoundTo);
}
