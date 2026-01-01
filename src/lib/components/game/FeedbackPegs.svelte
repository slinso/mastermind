<script lang="ts">
	import type { Feedback } from '$lib/types/game';

	interface Props {
		feedback: Feedback | null;
		positions: number;
	}

	let { feedback, positions }: Props = $props();

	// Erstelle ein Array mit Feedback-Farben
	const pegs = $derived.by(() => {
		if (!feedback) {
			return Array(positions).fill('empty');
		}

		const result: string[] = [];

		// Zuerst schwarze Stifte (richtige Position)
		for (let i = 0; i < feedback.black; i++) {
			result.push('black');
		}

		// Dann weiße Stifte (falsche Position)
		for (let i = 0; i < feedback.white; i++) {
			result.push('white');
		}

		// Rest mit leeren Stiften auffüllen
		while (result.length < positions) {
			result.push('empty');
		}

		return result;
	});

	const pegClasses: Record<string, string> = {
		black: 'bg-gray-900',
		white: 'bg-white border-gray-400',
		empty: 'bg-gray-300'
	};
</script>

<div class="grid grid-cols-2 gap-1">
	{#each pegs as peg, index (index)}
		<div
			class="w-3 h-3 rounded-full border {pegClasses[peg]}"
			aria-label={peg === 'black'
				? 'Richtige Farbe, richtige Position'
				: peg === 'white'
					? 'Richtige Farbe, falsche Position'
					: 'Leer'}
		></div>
	{/each}
</div>
