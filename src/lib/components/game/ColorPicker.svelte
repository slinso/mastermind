<script lang="ts">
	import type { ColorId } from '$lib/types/game';
	import { AVAILABLE_COLORS } from '$lib/types/game';
	import ColorPeg from './ColorPeg.svelte';

	interface Props {
		colorCount: number;
		onselect: (colorId: ColorId) => void;
		disabled?: boolean;
	}

	let { colorCount, onselect, disabled = false }: Props = $props();

	const availableColors = $derived(AVAILABLE_COLORS.slice(0, colorCount));
</script>

<div class="flex gap-2 flex-wrap justify-center p-2 bg-gray-100 rounded-lg">
	{#each availableColors as color (color.id)}
		<ColorPeg
			colorId={color.id}
			size="md"
			selectable={!disabled}
			onclick={() => onselect(color.id)}
		/>
	{/each}
</div>
