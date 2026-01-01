<script lang="ts">
	import type { ColorId, GameConfig } from '$lib/types/game';
	import { gameStore } from '$lib/stores/game.svelte';
	import SecretCode from './SecretCode.svelte';
	import GuessRow from './GuessRow.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import GameSettings from '$lib/components/settings/GameSettings.svelte';

	// Aktuell ausgewählte Position für Farbauswahl
	let selectedPosition = $state<number | null>(null);

	// Modal States
	let showSettings = $state(false);
	let showGameOver = $state(false);

	// Layout
	const isHorizontal = $derived(gameStore.config.layout === 'horizontal');

	// Game Over Modal bei Spielende anzeigen
	$effect(() => {
		if (gameStore.isGameOver) {
			showGameOver = true;
		}
	});

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
		selectedPosition = 0;
	}

	function handleNewGame() {
		gameStore.startNewGame();
		selectedPosition = 0;
		showGameOver = false;
	}

	function handleReset() {
		gameStore.resetCurrentGuess();
		selectedPosition = 0;
	}

	function handleSettingsSave(config: GameConfig) {
		gameStore.startNewGame(config);
		selectedPosition = 0;
		showSettings = false;
	}

	// Spielzeit berechnen
	const gameDuration = $derived.by(() => {
		if (!gameStore.endTime) return 0;
		return Math.round((gameStore.endTime - gameStore.startTime) / 1000);
	});

	function formatDuration(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
	}

	// Bei Spielstart erste Position auswählen
	$effect(() => {
		if (!gameStore.isGameOver && selectedPosition === null) {
			selectedPosition = 0;
		}
	});
</script>

<div class="flex flex-col gap-4 p-4" class:max-w-md={!isHorizontal} class:mx-auto={!isHorizontal}>
	<!-- Header mit Einstellungen -->
	<div class="flex justify-between items-center">
		<div class="text-sm text-gray-500">
			{gameStore.config.positions} Positionen | {gameStore.config.colorCount} Farben |
			{gameStore.config.allowDuplicates ? 'Mit' : 'Ohne'} Wiederholung |
			{isHorizontal ? 'Horizontal' : 'Vertikal'}
		</div>
		<button
			type="button"
			class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
			onclick={() => (showSettings = true)}
			aria-label="Einstellungen"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
				></path>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				></path>
			</svg>
		</button>
	</div>

	<!-- Spielstatus -->
	{#if !gameStore.isGameOver}
		<div class="text-center text-gray-600">
			Versuch {gameStore.currentGuessIndex + 1} von {gameStore.config.maxAttempts}
		</div>
	{/if}

	{#if isHorizontal}
		<!-- HORIZONTALES LAYOUT -->
		<div class="flex gap-2 items-start overflow-x-auto pb-2">
			<!-- Spielfeld mit Versuchen (horizontal) -->
			{#each gameStore.guesses as guess, index (index)}
				<GuessRow
					{guess}
					rowIndex={index}
					isActive={index === gameStore.currentGuessIndex && !gameStore.isGameOver}
					layout="horizontal"
					onPegClick={handlePegClick}
				/>
			{/each}

			<!-- Geheimcode (am Ende) -->
			<SecretCode code={gameStore.secretCode} revealed={gameStore.isGameOver} layout="horizontal" />
		</div>
	{:else}
		<!-- VERTIKALES LAYOUT -->
		<!-- Geheimcode -->
		<SecretCode code={gameStore.secretCode} revealed={gameStore.isGameOver} layout="vertical" />

		<!-- Spielfeld mit Versuchen -->
		<div class="flex flex-col gap-2">
			{#each gameStore.guesses as guess, index (index)}
				<GuessRow
					{guess}
					rowIndex={index}
					isActive={index === gameStore.currentGuessIndex && !gameStore.isGameOver}
					layout="vertical"
					onPegClick={handlePegClick}
				/>
			{/each}
		</div>
	{/if}

	<!-- Farbauswahl (nur wenn Spiel läuft) -->
	{#if !gameStore.isGameOver}
		<div class="space-y-4">
			<ColorPicker
				colorCount={gameStore.config.colorCount}
				onselect={handleColorSelect}
				disabled={gameStore.isGameOver}
			/>

			<div class="flex gap-2 justify-center">
				<Button variant="secondary" onclick={handleReset}>
					Zurücksetzen
				</Button>
				<Button variant="primary" onclick={handleSubmit} disabled={!gameStore.isCurrentGuessComplete}>
					Prüfen
				</Button>
			</div>
		</div>
	{:else}
		<div class="flex justify-center">
			<Button variant="success" onclick={handleNewGame}>
				Neues Spiel
			</Button>
		</div>
	{/if}
</div>

<!-- Settings Modal -->
<GameSettings
	open={showSettings}
	currentConfig={gameStore.config}
	onclose={() => (showSettings = false)}
	onsave={handleSettingsSave}
/>

<!-- Game Over Modal -->
<Modal open={showGameOver} title={gameStore.status === 'won' ? 'Gewonnen!' : 'Verloren!'} onclose={() => (showGameOver = false)}>
	<div class="text-center space-y-4">
		{#if gameStore.status === 'won'}
			<div class="text-6xl">🎉</div>
			<p class="text-green-600 text-lg">
				Du hast den Code in <strong>{gameStore.currentGuessIndex + 1}</strong> Versuchen geknackt!
			</p>
		{:else}
			<div class="text-6xl">😔</div>
			<p class="text-red-600 text-lg">Der Code wurde leider nicht geknackt.</p>
		{/if}

		<p class="text-gray-500">Spielzeit: {formatDuration(gameDuration)}</p>

		<div class="pt-4">
			<Button variant="success" onclick={handleNewGame}>
				Neues Spiel starten
			</Button>
		</div>
	</div>
</Modal>
