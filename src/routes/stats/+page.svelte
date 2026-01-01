<script lang="ts">
	import { gameStore } from '$lib/stores/game.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import {
		type Difficulty,
		DIFFICULTIES,
		calculateDifficulty,
		getDifficultyInfo
	} from '$lib/types/game';

	let showConfirmReset = $state(false);
	let selectedDifficulty = $state<Difficulty | 'all'>('all');

	// Gefilterte History nach Schwierigkeitsgrad
	const filteredHistory = $derived(
		selectedDifficulty === 'all'
			? gameStore.stats.history
			: gameStore.stats.history.filter(
					(game) => calculateDifficulty(game.config) === selectedDifficulty
				)
	);

	// Statistiken für aktuellen Filter berechnen
	const filteredStats = $derived.by(() => {
		const games = filteredHistory;
		const won = games.filter((g) => g.won);
		const lost = games.filter((g) => !g.won);

		return {
			gamesPlayed: games.length,
			gamesWon: won.length,
			gamesLost: lost.length,
			winRate: games.length > 0 ? Math.round((won.length / games.length) * 100) : 0,
			totalAttempts: won.reduce((sum, g) => sum + g.attempts, 0),
			averageAttempts: won.length > 0 ? Math.round((won.reduce((sum, g) => sum + g.attempts, 0) / won.length) * 10) / 10 : 0,
			bestAttempts: won.length > 0 ? Math.min(...won.map((g) => g.attempts)) : null,
			totalPlayTime: games.reduce((sum, g) => sum + g.duration, 0)
		};
	});

	function formatDuration(seconds: number): string {
		if (seconds < 60) {
			return `${seconds}s`;
		}
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		if (mins < 60) {
			return `${mins}m ${secs}s`;
		}
		const hours = Math.floor(mins / 60);
		const remainingMins = mins % 60;
		return `${hours}h ${remainingMins}m`;
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleDateString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function handleReset() {
		gameStore.clearStats();
		showConfirmReset = false;
	}
</script>

<svelte:head>
	<title>Statistiken - Mastermind</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
	<div class="container mx-auto px-4 max-w-2xl">
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<div>
				<h1 class="text-3xl font-bold text-gray-800">Statistiken</h1>
				<p class="text-gray-600">Deine Spielhistorie</p>
			</div>
			<a
				href="/"
				class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
			>
				Zurück zum Spiel
			</a>
		</div>

		<!-- Schwierigkeitsgrad-Filter -->
		<div class="flex flex-wrap gap-2 mb-6">
			<button
				type="button"
				class="px-4 py-2 rounded-lg font-medium transition-colors {selectedDifficulty === 'all'
					? 'bg-gray-800 text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				onclick={() => (selectedDifficulty = 'all')}
			>
				Alle
			</button>
			{#each DIFFICULTIES as diff (diff.id)}
				<button
					type="button"
					class="px-4 py-2 rounded-lg font-medium transition-colors {selectedDifficulty === diff.id
						? diff.color
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					onclick={() => (selectedDifficulty = diff.id)}
				>
					{diff.name}
				</button>
			{/each}
		</div>

		<!-- Übersicht -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
			<div class="bg-white rounded-xl p-4 shadow-sm text-center">
				<div class="text-3xl font-bold text-gray-800">{filteredStats.gamesPlayed}</div>
				<div class="text-sm text-gray-500">Spiele</div>
			</div>
			<div class="bg-white rounded-xl p-4 shadow-sm text-center">
				<div class="text-3xl font-bold text-green-600">{filteredStats.winRate}%</div>
				<div class="text-sm text-gray-500">Gewonnen</div>
			</div>
			<div class="bg-white rounded-xl p-4 shadow-sm text-center">
				<div class="text-3xl font-bold text-blue-600">
					{filteredStats.bestAttempts ?? '-'}
				</div>
				<div class="text-sm text-gray-500">Beste Runde</div>
			</div>
			<div class="bg-white rounded-xl p-4 shadow-sm text-center">
				<div class="text-3xl font-bold text-purple-600">
					{filteredStats.averageAttempts || '-'}
				</div>
				<div class="text-sm text-gray-500">Ø Versuche</div>
			</div>
		</div>

		<!-- Detaillierte Statistiken -->
		<div class="bg-white rounded-xl p-6 shadow-sm mb-8">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Details</h2>
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div class="flex justify-between">
					<span class="text-gray-500">Gewonnen:</span>
					<span class="font-medium text-green-600">{filteredStats.gamesWon}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-500">Verloren:</span>
					<span class="font-medium text-red-600">{filteredStats.gamesLost}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-500">Gesamtspielzeit:</span>
					<span class="font-medium">{formatDuration(filteredStats.totalPlayTime)}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-500">Ø Spielzeit:</span>
					<span class="font-medium">
						{filteredStats.gamesPlayed > 0
							? formatDuration(Math.round(filteredStats.totalPlayTime / filteredStats.gamesPlayed))
							: '-'}
					</span>
				</div>
			</div>
		</div>

		<!-- Spielverlauf -->
		<div class="bg-white rounded-xl p-6 shadow-sm mb-8">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">
				Letzte Spiele
				{#if selectedDifficulty !== 'all'}
					<span class="text-sm font-normal text-gray-500">
						({getDifficultyInfo(selectedDifficulty).name})
					</span>
				{/if}
			</h2>

			{#if filteredHistory.length === 0}
				<p class="text-gray-500 text-center py-8">
					{#if selectedDifficulty === 'all'}
						Noch keine Spiele gespielt. Starte ein Spiel, um Statistiken zu sammeln!
					{:else}
						Keine Spiele in dieser Schwierigkeitsstufe.
					{/if}
				</p>
			{:else}
				<div class="space-y-2 max-h-96 overflow-y-auto">
					{#each filteredHistory as game (game.id)}
						{@const difficulty = getDifficultyInfo(calculateDifficulty(game.config))}
						<div
							class="flex items-center justify-between p-3 rounded-lg"
							class:bg-green-50={game.won}
							class:bg-red-50={!game.won}
						>
							<div class="flex items-center gap-3">
								<span class="text-xl">{game.won ? '🎉' : '😔'}</span>
								<div>
									<div class="flex items-center gap-2">
										<span class="font-medium text-gray-800">
											{game.won ? 'Gewonnen' : 'Verloren'} in {game.attempts} Versuchen
										</span>
										<span class="text-xs px-2 py-0.5 rounded {difficulty.color}">
											{difficulty.name}
										</span>
									</div>
									<div class="text-xs text-gray-500">
										{game.config.positions} Pos. | {game.config.colorCount} Farben |
										{game.config.allowDuplicates ? 'Mit' : 'Ohne'} Wdh.
									</div>
								</div>
							</div>
							<div class="text-right text-sm text-gray-500">
								<div>{formatDuration(game.duration)}</div>
								<div class="text-xs">{formatDate(game.date)}</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Reset Button -->
		<div class="text-center">
			<Button variant="danger" onclick={() => (showConfirmReset = true)}>
				Statistiken zurücksetzen
			</Button>
		</div>
	</div>
</main>

<!-- Bestätigungs-Modal -->
<Modal open={showConfirmReset} title="Statistiken zurücksetzen?" onclose={() => (showConfirmReset = false)}>
	<p class="text-gray-600 mb-4">
		Möchtest du wirklich alle Statistiken löschen? Diese Aktion kann nicht rückgängig gemacht werden.
	</p>

	{#snippet footer()}
		<div class="flex gap-2 justify-end">
			<Button variant="secondary" onclick={() => (showConfirmReset = false)}>
				Abbrechen
			</Button>
			<Button variant="danger" onclick={handleReset}>
				Ja, zurücksetzen
			</Button>
		</div>
	{/snippet}
</Modal>
