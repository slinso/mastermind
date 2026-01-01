<script lang="ts">
	import { gameStore } from '$lib/stores/game.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	let showConfirmReset = $state(false);

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

		<!-- Übersicht -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
			<div class="bg-white rounded-xl p-4 shadow-sm text-center">
				<div class="text-3xl font-bold text-gray-800">{gameStore.stats.gamesPlayed}</div>
				<div class="text-sm text-gray-500">Spiele</div>
			</div>
			<div class="bg-white rounded-xl p-4 shadow-sm text-center">
				<div class="text-3xl font-bold text-green-600">{gameStore.winRate}%</div>
				<div class="text-sm text-gray-500">Gewonnen</div>
			</div>
			<div class="bg-white rounded-xl p-4 shadow-sm text-center">
				<div class="text-3xl font-bold text-blue-600">
					{gameStore.stats.bestAttempts ?? '-'}
				</div>
				<div class="text-sm text-gray-500">Beste Runde</div>
			</div>
			<div class="bg-white rounded-xl p-4 shadow-sm text-center">
				<div class="text-3xl font-bold text-purple-600">
					{gameStore.averageAttempts || '-'}
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
					<span class="font-medium text-green-600">{gameStore.stats.gamesWon}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-500">Verloren:</span>
					<span class="font-medium text-red-600">{gameStore.stats.gamesLost}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-500">Gesamtspielzeit:</span>
					<span class="font-medium">{formatDuration(gameStore.stats.totalPlayTime)}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-500">Ø Spielzeit:</span>
					<span class="font-medium">
						{gameStore.stats.gamesPlayed > 0
							? formatDuration(Math.round(gameStore.stats.totalPlayTime / gameStore.stats.gamesPlayed))
							: '-'}
					</span>
				</div>
			</div>
		</div>

		<!-- Spielverlauf -->
		<div class="bg-white rounded-xl p-6 shadow-sm mb-8">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Letzte Spiele</h2>

			{#if gameStore.stats.history.length === 0}
				<p class="text-gray-500 text-center py-8">
					Noch keine Spiele gespielt. Starte ein Spiel, um Statistiken zu sammeln!
				</p>
			{:else}
				<div class="space-y-2 max-h-96 overflow-y-auto">
					{#each gameStore.stats.history as game (game.id)}
						<div
							class="flex items-center justify-between p-3 rounded-lg"
							class:bg-green-50={game.won}
							class:bg-red-50={!game.won}
						>
							<div class="flex items-center gap-3">
								<span class="text-xl">{game.won ? '🎉' : '😔'}</span>
								<div>
									<div class="font-medium text-gray-800">
										{game.won ? 'Gewonnen' : 'Verloren'} in {game.attempts} Versuchen
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
