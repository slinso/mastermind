<script lang="ts">
	import GameBoard from '$lib/components/game/GameBoard.svelte';
</script>

<svelte:head>
	<title>Mastermind</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
	<div class="container mx-auto px-4">
		<header class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-800 mb-2">Mastermind</h1>
			<p class="text-gray-600">Knacke den geheimen Farbcode!</p>
			<a
				href="/stats"
				class="inline-block mt-2 text-blue-500 hover:text-blue-700 text-sm underline"
			>
				Statistiken anzeigen
			</a>
		</header>

		<GameBoard />

		<footer class="mt-8 text-center text-gray-500 text-sm">
			<p>
				<strong>Anleitung:</strong> Klicke auf eine Position und wähle eine Farbe aus. Wenn alle Positionen
				gefüllt sind, klicke auf "Prüfen".
			</p>
			<p class="mt-2">
				<span class="inline-block w-3 h-3 rounded-full bg-gray-900 mr-1"></span> = Richtige Farbe,
				richtige Position |
				<span class="inline-block w-3 h-3 rounded-full bg-white border border-gray-400 mr-1"></span>
				= Richtige Farbe, falsche Position
			</p>
		</footer>
	</div>
</main>
