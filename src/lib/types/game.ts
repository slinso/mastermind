/** Verfügbare Farb-IDs (0-7) */
export type ColorId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Farb-Definition mit ID und visuellem Wert */
export interface Color {
	id: ColorId;
	name: string;
	hex: string;
	tailwind: string;
}

/** Feedback für einen Versuch */
export interface Feedback {
	black: number; // Richtige Farbe, richtige Position
	white: number; // Richtige Farbe, falsche Position
}

/** Ein einzelner Versuch */
export interface Guess {
	colors: (ColorId | null)[]; // null = noch nicht gesetzt
	feedback: Feedback | null; // null = noch nicht bewertet
	isComplete: boolean;
}

/** Spielkonfiguration */
export interface GameConfig {
	positions: number; // 3-6, Standard: 4
	colorCount: number; // 4-8, Standard: 6
	maxAttempts: number; // Standard: 10
	allowDuplicates: boolean; // Farbwiederholung erlaubt?
}

/** Spielstatus */
export type GameStatus = 'playing' | 'won' | 'lost';

/** Kompletter Spielzustand */
export interface GameState {
	config: GameConfig;
	secretCode: ColorId[];
	guesses: Guess[];
	currentGuessIndex: number;
	status: GameStatus;
	startTime: number;
	endTime: number | null;
}

/** Standard-Konfiguration */
export const DEFAULT_CONFIG: GameConfig = {
	positions: 4,
	colorCount: 6,
	maxAttempts: 10,
	allowDuplicates: true
};

/** Verfügbare Farben (8 Stück) */
export const AVAILABLE_COLORS: Color[] = [
	{ id: 0, name: 'Rot', hex: '#ef4444', tailwind: 'bg-red-500' },
	{ id: 1, name: 'Blau', hex: '#3b82f6', tailwind: 'bg-blue-500' },
	{ id: 2, name: 'Gelb', hex: '#eab308', tailwind: 'bg-yellow-500' },
	{ id: 3, name: 'Grün', hex: '#22c55e', tailwind: 'bg-green-500' },
	{ id: 4, name: 'Orange', hex: '#f97316', tailwind: 'bg-orange-500' },
	{ id: 5, name: 'Lila', hex: '#a855f7', tailwind: 'bg-purple-500' },
	{ id: 6, name: 'Pink', hex: '#ec4899', tailwind: 'bg-pink-500' },
	{ id: 7, name: 'Türkis', hex: '#14b8a6', tailwind: 'bg-teal-500' }
];
