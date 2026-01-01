<script lang="ts">
	import type { ColorId, LayoutOrientation } from '$lib/types/game';
	import ColorPeg from './ColorPeg.svelte';

	interface Props {
		code: ColorId[];
		revealed: boolean;
		layout?: LayoutOrientation;
	}

	let { code, revealed, layout = 'vertical' }: Props = $props();

	const isHorizontal = $derived(layout === 'horizontal');
</script>

<div
	class="bg-gray-800 rounded-lg p-3"
	class:flex={!isHorizontal}
	class:items-center={!isHorizontal}
	class:gap-4={!isHorizontal}
>
	<span class="text-white font-semibold text-sm" class:mb-2={isHorizontal} class:block={isHorizontal} class:text-center={isHorizontal}>
		CODE
	</span>

	<div class:flex={!isHorizontal} class:gap-2={!isHorizontal} class:flex-col={isHorizontal} class:items-center={isHorizontal} class:space-y-1={isHorizontal}>
		{#each code as colorId, index (index)}
			{#if revealed}
				<ColorPeg {colorId} size={isHorizontal ? 'md' : 'lg'} />
			{:else}
				<div
					class="rounded-full bg-gray-600 border-2 border-gray-500 flex items-center justify-center {isHorizontal ? 'w-10 h-10' : 'w-12 h-12'}"
				>
					<span class="text-gray-400 {isHorizontal ? 'text-lg' : 'text-xl'}">?</span>
				</div>
			{/if}
		{/each}
	</div>
</div>
