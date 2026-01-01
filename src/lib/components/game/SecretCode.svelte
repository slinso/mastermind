<script lang="ts">
	import type { ColorId } from '$lib/types/game';
	import ColorPeg from './ColorPeg.svelte';

	interface Props {
		code: ColorId[];
		revealed: boolean;
	}

	let { code, revealed }: Props = $props();
</script>

<div class="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
	<span class="text-white font-semibold text-sm">CODE</span>

	<div class="flex gap-2">
		{#each code as colorId, index (index)}
			{#if revealed}
				<ColorPeg {colorId} size="lg" />
			{:else}
				<div
					class="w-12 h-12 rounded-full bg-gray-600 border-2 border-gray-500 flex items-center justify-center"
				>
					<span class="text-gray-400 text-xl">?</span>
				</div>
			{/if}
		{/each}
	</div>
</div>
