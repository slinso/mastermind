<script lang="ts">
	import type { Guess, LayoutOrientation } from '$lib/types/game';
	import ColorPeg from './ColorPeg.svelte';
	import FeedbackPegs from './FeedbackPegs.svelte';

	interface Props {
		guess: Guess;
		rowIndex: number;
		isActive: boolean;
		layout?: LayoutOrientation;
		onPegClick?: (position: number) => void;
	}

	let { guess, rowIndex, isActive, layout = 'vertical', onPegClick }: Props = $props();

	const isHorizontal = $derived(layout === 'horizontal');
</script>

{#if isHorizontal}
	<!-- Horizontales Spielfeld: Spalte (vertikal angeordnet) -->
	<div
		class="flex flex-col items-center gap-2 p-2 rounded-lg transition-colors"
		class:bg-blue-50={isActive}
		class:border-2={isActive}
		class:border-blue-300={isActive}
	>
		<!-- Spaltennummer -->
		<span class="text-center text-gray-500 font-mono text-sm">
			{rowIndex + 1}
		</span>

		<!-- Farbstifte (vertikal) -->
		<div class="flex flex-col gap-1">
			{#each guess.colors as colorId, position (position)}
				<ColorPeg
					{colorId}
					size="md"
					selectable={isActive}
					onclick={() => onPegClick?.(position)}
				/>
			{/each}
		</div>

		<!-- Feedback -->
		<div class="mt-1">
			<FeedbackPegs feedback={guess.feedback} positions={guess.colors.length} />
		</div>
	</div>
{:else}
	<!-- Vertikales Spielfeld: Zeile (horizontal angeordnet) -->
	<div
		class="flex items-center gap-4 p-2 rounded-lg transition-colors"
		class:bg-blue-50={isActive}
		class:border-2={isActive}
		class:border-blue-300={isActive}
	>
		<!-- Zeilennummer -->
		<span class="w-6 text-center text-gray-500 font-mono text-sm">
			{rowIndex + 1}
		</span>

		<!-- Farbstifte (horizontal) -->
		<div class="flex gap-2">
			{#each guess.colors as colorId, position (position)}
				<ColorPeg
					{colorId}
					size="lg"
					selectable={isActive}
					onclick={() => onPegClick?.(position)}
				/>
			{/each}
		</div>

		<!-- Feedback -->
		<div class="ml-2">
			<FeedbackPegs feedback={guess.feedback} positions={guess.colors.length} />
		</div>
	</div>
{/if}
