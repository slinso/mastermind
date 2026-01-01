<script lang="ts">
	import type { ColorId } from '$lib/types/game';
	import { gameStore } from '$lib/stores/game.svelte';
	import SecretCode from './SecretCode.svelte';
	import GuessRow from './GuessRow.svelte';
	import ColorPicker from './ColorPicker.svelte';

	// Aktuell ausgewählte Position für Farbauswahl
	let selectedPosition = $state<number | null>(null);

	function handlePegClick(position: number) {
		if (gameStore.isGameOver) return;
		selectedPosition = position;
	}

	function handleColorSelect(colorId: ColorId) {
		if (selectedPosition === null) return;

		gameStore.setColor(selectedPosition, colorId);

		// Zur nächsten leeren Position wechseln
		const currentGuess = gameStore.currentGuess;
		if (currentGuess) {
			const nextEmpty = currentGuess.colors.findIndex(
				(c, i) => c === null && i !== selectedPosition
			);
			selectedPosition = nextEmpty >= 0 ? nextEmpty : null;
		}
	}

	function handleSubmit() {
		gameStore.submitGuess();
		selectedPosition = 0; // Erste Position für nächsten Versuch
	}

	function handleNewGame() {
		gameStore.startNewGame();
		selectedPosition = 0;
	}

	function handleReset() {
		gameStore.resetCurrentGuess();
		selectedPosition = 0;
	}

	// Bei Spielstart erste Position auswählen
	$effect(() => {
		if (!gameStore.isGameOver && selectedPosition === null) {
			selectedPosition = 0;
		}
	});
</script>

<div class="flex flex-col gap-6 max-w-md mx-auto p-4">
	<!-- Geheimcode -->
	<SecretCode code={gameStore.secretCode} revealed={gameStore.isGameOver} />

	<!-- Spielstatus -->
	{#if gameStore.isGameOver}
		<div
			class="text-center p-4 rounded-lg"
			class:bg-green-100={gameStore.status === 'won'}
			class:bg-red-100={gameStore.status === 'lost'}
		>
			{#if gameStore.status === 'won'}
				<p class="text-green-800 font-bold text-xl">Gewonnen!</p>
				<p class="text-green-600">
					Du hast den Code in {gameStore.currentGuessIndex + 1} Versuchen geknackt!
				</p>
			{:else}
				<p class="text-red-800 font-bold text-xl">Verloren!</p>
				<p class="text-red-600">Der Code wurde nicht geknackt.</p>
			{/if}
		</div>
	{:else}
		<div class="text-center text-gray-600">
			Versuch {gameStore.currentGuessIndex + 1} von {gameStore.config.maxAttempts}
		</div>
	{/if}

	<!-- Spielfeld mit Versuchen -->
	<div class="flex flex-col gap-2">
		{#each gameStore.guesses as guess, index (index)}
			<GuessRow
				{guess}
				rowIndex={index}
				isActive={index === gameStore.currentGuessIndex && !gameStore.isGameOver}
				onPegClick={handlePegClick}
			/>
		{/each}
	</div>

	<!-- Farbauswahl (nur wenn Spiel läuft) -->
	{#if !gameStore.isGameOver}
		<div class="space-y-4">
			<ColorPicker
				colorCount={gameStore.config.colorCount}
				onselect={handleColorSelect}
				disabled={gameStore.isGameOver}
			/>

			<div class="flex gap-2 justify-center">
				<button
					type="button"
					class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
					onclick={handleReset}
				>
					Zurücksetzen
				</button>
				<button
					type="button"
					class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					onclick={handleSubmit}
					disabled={!gameStore.isCurrentGuessComplete}
				>
					Prüfen
				</button>
			</div>
		</div>
	{/if}

	<!-- Neues Spiel Button -->
	<button
		type="button"
		class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
		onclick={handleNewGame}
	>
		Neues Spiel
	</button>
</div>
