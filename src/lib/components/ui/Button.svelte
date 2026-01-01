<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'success';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		onclick,
		children
	}: Props = $props();

	const baseClasses =
		'font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClasses: Record<string, string> = {
		primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 active:bg-blue-700',
		secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400',
		danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 active:bg-red-700',
		success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 active:bg-green-700'
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};
</script>

<button
	{type}
	class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]}"
	{disabled}
	{onclick}
>
	{@render children()}
</button>
