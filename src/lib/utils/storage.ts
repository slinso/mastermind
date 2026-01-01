import type { GameConfig, GameStats } from '$lib/types/game';
import { DEFAULT_CONFIG, DEFAULT_STATS } from '$lib/types/game';
import { browser } from '$app/environment';

const STORAGE_KEYS = {
	CONFIG: 'mastermind_config',
	STATS: 'mastermind_stats'
} as const;

/**
 * Speichert die Spielkonfiguration im localStorage.
 */
export function saveConfig(config: GameConfig): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
	} catch (error) {
		console.error('Fehler beim Speichern der Konfiguration:', error);
	}
}

/**
 * Lädt die Spielkonfiguration aus dem localStorage.
 */
export function loadConfig(): GameConfig {
	if (!browser) return { ...DEFAULT_CONFIG };

	try {
		const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
		if (stored) {
			const parsed = JSON.parse(stored) as Partial<GameConfig>;
			// Merge mit Default-Werten für fehlende Felder
			return { ...DEFAULT_CONFIG, ...parsed };
		}
	} catch (error) {
		console.error('Fehler beim Laden der Konfiguration:', error);
	}

	return { ...DEFAULT_CONFIG };
}

/**
 * Speichert die Spielstatistiken im localStorage.
 */
export function saveStats(stats: GameStats): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
	} catch (error) {
		console.error('Fehler beim Speichern der Statistiken:', error);
	}
}

/**
 * Lädt die Spielstatistiken aus dem localStorage.
 */
export function loadStats(): GameStats {
	if (!browser) return { ...DEFAULT_STATS, history: [] };

	try {
		const stored = localStorage.getItem(STORAGE_KEYS.STATS);
		if (stored) {
			const parsed = JSON.parse(stored) as Partial<GameStats>;
			// Merge mit Default-Werten für fehlende Felder
			return {
				...DEFAULT_STATS,
				...parsed,
				history: parsed.history ?? []
			};
		}
	} catch (error) {
		console.error('Fehler beim Laden der Statistiken:', error);
	}

	return { ...DEFAULT_STATS, history: [] };
}

/**
 * Setzt die Statistiken zurück.
 */
export function resetStats(): void {
	if (!browser) return;

	try {
		localStorage.removeItem(STORAGE_KEYS.STATS);
	} catch (error) {
		console.error('Fehler beim Zurücksetzen der Statistiken:', error);
	}
}

/**
 * Generiert eine eindeutige ID für einen Spielverlauf.
 */
export function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
