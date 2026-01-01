<script lang="ts">
	interface Props {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		id?: string;
		onchange?: (value: number) => void;
	}

	let { value = $bindable(), min = 0, max = 100, step = 1, label, id, onchange }: Props = $props();

	function handleDecrement() {
		if (value > min) {
			value = value - step;
			onchange?.(value);
		}
	}

	function handleIncrement() {
		if (value < max) {
			value = value + step;
			onchange?.(value);
		}
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		let newValue = parseInt(target.value, 10);

		if (isNaN(newValue)) {
			newValue = min;
		} else if (newValue < min) {
			newValue = min;
		} else if (newValue > max) {
			newValue = max;
		}

		value = newValue;
		onchange?.(value);
	}
</script>

<div class="flex flex-col gap-1">
	{#if label}
		<label for={id} class="text-sm font-medium text-gray-700">
			{label}
		</label>
	{/if}

	<div class="flex items-center gap-2">
		<button
			type="button"
			class="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			onclick={handleDecrement}
			disabled={value <= min}
			aria-label="Verringern"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
			</svg>
		</button>

		<input
			{id}
			type="number"
			class="w-16 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			{value}
			{min}
			{max}
			{step}
			oninput={handleInput}
		/>

		<button
			type="button"
			class="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			onclick={handleIncrement}
			disabled={value >= max}
			aria-label="Erhöhen"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
				></path>
			</svg>
		</button>
	</div>
</div>
