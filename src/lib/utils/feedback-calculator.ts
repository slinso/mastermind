import type { ColorId, Feedback } from '$lib/types/game';

/**
 * Berechnet das Feedback für einen Rateversuch.
 *
 * @param guess - Der Rateversuch des Spielers
 * @param secret - Der geheime Code
 * @returns Feedback mit Anzahl schwarzer und weißer Stifte
 *
 * Schwarze Stifte: Richtige Farbe an der richtigen Position
 * Weiße Stifte: Richtige Farbe an der falschen Position
 */
export function calculateFeedback(guess: ColorId[], secret: ColorId[]): Feedback {
	let black = 0;
	let white = 0;

	// Kopien erstellen, um die Originale nicht zu verändern
	const secretCopy = [...secret];
	const guessCopy = [...guess];

	// Erst schwarze Stifte zählen (richtige Position)
	// Von hinten durchgehen, um Indizes beim Entfernen nicht zu verschieben
	for (let i = guessCopy.length - 1; i >= 0; i--) {
		if (guessCopy[i] === secretCopy[i]) {
			black++;
			guessCopy.splice(i, 1);
			secretCopy.splice(i, 1);
		}
	}

	// Dann weiße Stifte zählen (richtige Farbe, falsche Position)
	for (const color of guessCopy) {
		const index = secretCopy.indexOf(color);
		if (index !== -1) {
			white++;
			secretCopy.splice(index, 1);
		}
	}

	return { black, white };
}
