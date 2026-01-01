<script lang="ts">
	import type { Guess } from '$lib/types/game';
	import ColorPeg from './ColorPeg.svelte';
	import FeedbackPegs from './FeedbackPegs.svelte';

	interface Props {
		guess: Guess;
		rowIndex: number;
		isActive: boolean;
		onPegClick?: (position: number) => void;
	}

	let { guess, rowIndex, isActive, onPegClick }: Props = $props();
</script>

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

	<!-- Farbstifte -->
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
