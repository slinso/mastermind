<script lang="ts">
	import type { ColorId } from '$lib/types/game';
	import { AVAILABLE_COLORS } from '$lib/types/game';

	interface Props {
		colorId: ColorId | null;
		size?: 'sm' | 'md' | 'lg';
		onclick?: () => void;
		selectable?: boolean;
	}

	let { colorId, size = 'md', onclick, selectable = false }: Props = $props();

	const color = $derived(colorId !== null ? AVAILABLE_COLORS[colorId] : null);

	const sizeClasses: Record<string, string> = {
		sm: 'w-6 h-6',
		md: 'w-10 h-10',
		lg: 'w-12 h-12'
	};

	const baseClasses =
		'rounded-full border-2 border-gray-400 transition-all duration-150 shadow-inner';
	const selectableClasses = 'cursor-pointer hover:scale-110 hover:shadow-md active:scale-95';
	const emptyClasses = 'bg-gray-200';
</script>

<button
	type="button"
	class="{baseClasses} {sizeClasses[size]} {color?.tailwind ?? emptyClasses}"
	class:cursor-pointer={selectable}
	class:hover:scale-110={selectable}
	class:hover:shadow-md={selectable}
	class:active:scale-95={selectable}
	{onclick}
	disabled={!selectable}
	aria-label={color?.name ?? 'Leer'}
></button>
