import type { ColorId, GameConfig } from '$lib/types/game';

/**
 * Generiert einen zufälligen Geheimcode basierend auf der Spielkonfiguration.
 */
export function generateSecretCode(config: GameConfig): ColorId[] {
	const colors: ColorId[] = [];
	const available = Array.from({ length: config.colorCount }, (_, i) => i as ColorId);

	for (let i = 0; i < config.positions; i++) {
		if (config.allowDuplicates) {
			// Mit Wiederholung: Zufällige Farbe aus allen verfügbaren
			const randomIndex = Math.floor(Math.random() * config.colorCount);
			colors.push(randomIndex as ColorId);
		} else {
			// Ohne Wiederholung: Farbe entfernen nach Verwendung
			const randomIndex = Math.floor(Math.random() * available.length);
			colors.push(available.splice(randomIndex, 1)[0]);
		}
	}

	return colors;
}
