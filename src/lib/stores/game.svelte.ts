import type { GameConfig, ColorId, Guess, Feedback, GameStatus } from '$lib/types/game';
import { DEFAULT_CONFIG } from '$lib/types/game';
import { generateSecretCode } from '$lib/utils/code-generator';
import { calculateFeedback } from '$lib/utils/feedback-calculator';

/**
 * Erstellt einen leeren Rateversuch.
 */
function createEmptyGuess(positions: number): Guess {
	return {
		colors: Array(positions).fill(null),
		feedback: null,
		isComplete: false
	};
}

/**
 * Erstellt ein Array von leeren Rateversuchen.
 */
function createEmptyGuesses(config: GameConfig): Guess[] {
	return Array.from({ length: config.maxAttempts }, () => createEmptyGuess(config.positions));
}

/**
 * Reaktiver Game Store mit Svelte 5 Runes.
 * Verwaltet den kompletten Spielzustand.
 */
function createGameStore() {
	let config = $state<GameConfig>({ ...DEFAULT_CONFIG });
	let secretCode = $state<ColorId[]>([]);
	let guesses = $state<Guess[]>([]);
	let currentGuessIndex = $state(0);
	let status = $state<GameStatus>('playing');
	let startTime = $state(0);
	let endTime = $state<number | null>(null);

	// Abgeleitete Werte
	const currentGuess = $derived(guesses[currentGuessIndex]);
	const isCurrentGuessComplete = $derived(
		currentGuess?.colors.every((c) => c !== null) ?? false
	);
	const attemptsRemaining = $derived(config.maxAttempts - currentGuessIndex);
	const isGameOver = $derived(status !== 'playing');

	/**
	 * Startet ein neues Spiel mit optionaler Konfiguration.
	 */
	function startNewGame(newConfig?: Partial<GameConfig>) {
		if (newConfig) {
			config = { ...config, ...newConfig };
		}
		secretCode = generateSecretCode(config);
		guesses = createEmptyGuesses(config);
		currentGuessIndex = 0;
		status = 'playing';
		startTime = Date.now();
		endTime = null;
	}

	/**
	 * Setzt eine Farbe an einer bestimmten Position im aktuellen Versuch.
	 */
	function setColor(position: number, colorId: ColorId) {
		if (status !== 'playing') return;
		if (position < 0 || position >= config.positions) return;

		guesses[currentGuessIndex].colors[position] = colorId;
	}

	/**
	 * Löscht eine Farbe an einer bestimmten Position im aktuellen Versuch.
	 */
	function clearColor(position: number) {
		if (status !== 'playing') return;
		if (position < 0 || position >= config.positions) return;

		guesses[currentGuessIndex].colors[position] = null;
	}

	/**
	 * Setzt den aktuellen Versuch zurück.
	 */
	function resetCurrentGuess() {
		if (status !== 'playing') return;

		guesses[currentGuessIndex] = createEmptyGuess(config.positions);
	}

	/**
	 * Gibt den aktuellen Versuch ab und berechnet das Feedback.
	 */
	function submitGuess() {
		if (!isCurrentGuessComplete || status !== 'playing') return;

		const guess = guesses[currentGuessIndex];
		const feedback = calculateFeedback(guess.colors as ColorId[], secretCode);

		guesses[currentGuessIndex].feedback = feedback;
		guesses[currentGuessIndex].isComplete = true;

		// Gewonnen?
		if (feedback.black === config.positions) {
			status = 'won';
			endTime = Date.now();
			return;
		}

		// Verloren?
		if (currentGuessIndex >= config.maxAttempts - 1) {
			status = 'lost';
			endTime = Date.now();
			return;
		}

		// Nächster Versuch
		currentGuessIndex++;
	}

	// Initialisiere das erste Spiel
	startNewGame();

	return {
		// Getter für reaktive Werte
		get config() {
			return config;
		},
		get secretCode() {
			return secretCode;
		},
		get guesses() {
			return guesses;
		},
		get currentGuessIndex() {
			return currentGuessIndex;
		},
		get status() {
			return status;
		},
		get startTime() {
			return startTime;
		},
		get endTime() {
			return endTime;
		},
		get currentGuess() {
			return currentGuess;
		},
		get isCurrentGuessComplete() {
			return isCurrentGuessComplete;
		},
		get attemptsRemaining() {
			return attemptsRemaining;
		},
		get isGameOver() {
			return isGameOver;
		},

		// Methoden
		startNewGame,
		setColor,
		clearColor,
		resetCurrentGuess,
		submitGuess
	};
}

// Singleton-Export
export const gameStore = createGameStore();
