<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	interface Props {
		open: boolean;
		title?: string;
		onclose?: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let { open, title, onclose, children, footer }: Props = $props();

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget && onclose) {
			onclose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && onclose) {
			onclose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		transition:fade={{ duration: 150 }}
		onclick={handleBackdropClick}
		role="presentation"
	>
		<!-- Modal Content -->
		<div
			class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto"
			transition:scale={{ duration: 150, start: 0.95 }}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
		>
			<!-- Header -->
			{#if title || onclose}
				<div class="flex items-center justify-between p-4 border-b">
					{#if title}
						<h2 id="modal-title" class="text-xl font-semibold text-gray-800">
							{title}
						</h2>
					{/if}
					{#if onclose}
						<button
							type="button"
							class="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
							onclick={onclose}
							aria-label="Schließen"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					{/if}
				</div>
			{/if}

			<!-- Body -->
			<div class="p-4">
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="p-4 border-t bg-gray-50 rounded-b-xl">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
