import type { GameConfig, ColorId, Guess, GameStatus, GameStats, GameHistoryEntry } from '$lib/types/game';
import { DEFAULT_CONFIG, DEFAULT_STATS } from '$lib/types/game';
import { generateSecretCode } from '$lib/utils/code-generator';
import { calculateFeedback } from '$lib/utils/feedback-calculator';
import { saveConfig, loadConfig, saveStats, loadStats, resetStats, generateId } from '$lib/utils/storage';
import { browser } from '$app/environment';

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
 * Verwaltet den kompletten Spielzustand und Statistiken.
 */
function createGameStore() {
	// Konfiguration aus localStorage laden (nur im Browser)
	const initialConfig = browser ? loadConfig() : { ...DEFAULT_CONFIG };
	const initialStats = browser ? loadStats() : { ...DEFAULT_STATS, history: [] };

	let config = $state<GameConfig>(initialConfig);
	let secretCode = $state<ColorId[]>([]);
	let guesses = $state<Guess[]>([]);
	let currentGuessIndex = $state(0);
	let status = $state<GameStatus>('playing');
	let startTime = $state(0);
	let endTime = $state<number | null>(null);

	// Statistiken
	let stats = $state<GameStats>(initialStats);

	// Abgeleitete Werte
	const currentGuess = $derived(guesses[currentGuessIndex]);
	const isCurrentGuessComplete = $derived(
		currentGuess?.colors.every((c) => c !== null) ?? false
	);
	const attemptsRemaining = $derived(config.maxAttempts - currentGuessIndex);
	const isGameOver = $derived(status !== 'playing');

	// Abgeleitete Statistik-Werte
	const winRate = $derived(
		stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0
	);
	const averageAttempts = $derived(
		stats.gamesWon > 0 ? Math.round((stats.totalAttempts / stats.gamesWon) * 10) / 10 : 0
	);

	/**
	 * Speichert die aktuelle Konfiguration.
	 */
	function persistConfig() {
		if (browser) {
			saveConfig(config);
		}
	}

	/**
	 * Speichert die aktuellen Statistiken.
	 */
	function persistStats() {
		if (browser) {
			saveStats(stats);
		}
	}

	/**
	 * Aktualisiert die Statistiken nach einem Spielende.
	 */
	function updateStats(won: boolean, attempts: number, duration: number) {
		const historyEntry: GameHistoryEntry = {
			id: generateId(),
			date: Date.now(),
			config: { ...config },
			attempts,
			won,
			duration
		};

		stats.gamesPlayed++;
		stats.totalPlayTime += duration;
		stats.history = [historyEntry, ...stats.history].slice(0, 50); // Max 50 Einträge

		if (won) {
			stats.gamesWon++;
			stats.totalAttempts += attempts;

			if (stats.bestAttempts === null || attempts < stats.bestAttempts) {
				stats.bestAttempts = attempts;
			}
		} else {
			stats.gamesLost++;
		}

		persistStats();
	}

	/**
	 * Startet ein neues Spiel mit optionaler Konfiguration.
	 */
	function startNewGame(newConfig?: Partial<GameConfig>) {
		if (newConfig) {
			config = { ...config, ...newConfig };
			persistConfig();
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
			const duration = Math.round((endTime - startTime) / 1000);
			updateStats(true, currentGuessIndex + 1, duration);
			return;
		}

		// Verloren?
		if (currentGuessIndex >= config.maxAttempts - 1) {
			status = 'lost';
			endTime = Date.now();
			const duration = Math.round((endTime - startTime) / 1000);
			updateStats(false, config.maxAttempts, duration);
			return;
		}

		// Nächster Versuch
		currentGuessIndex++;
	}

	/**
	 * Setzt die Statistiken zurück.
	 */
	function clearStats() {
		stats = { ...DEFAULT_STATS, history: [] };
		resetStats();
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

		// Statistik-Getter
		get stats() {
			return stats;
		},
		get winRate() {
			return winRate;
		},
		get averageAttempts() {
			return averageAttempts;
		},

		// Methoden
		startNewGame,
		setColor,
		clearColor,
		resetCurrentGuess,
		submitGuess,
		clearStats
	};
}

// Singleton-Export
export const gameStore = createGameStore();
