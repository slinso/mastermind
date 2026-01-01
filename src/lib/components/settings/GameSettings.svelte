<script lang="ts">
	import type { GameConfig } from '$lib/types/game';
	import { DEFAULT_CONFIG } from '$lib/types/game';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	interface Props {
		open: boolean;
		currentConfig: GameConfig;
		onclose: () => void;
		onsave: (config: GameConfig) => void;
	}

	let { open, currentConfig, onclose, onsave }: Props = $props();

	// Lokale Kopie der Einstellungen (wird beim Öffnen aktualisiert)
	let positions = $state(DEFAULT_CONFIG.positions);
	let colorCount = $state(DEFAULT_CONFIG.colorCount);
	let maxAttempts = $state(DEFAULT_CONFIG.maxAttempts);
	let allowDuplicates = $state(DEFAULT_CONFIG.allowDuplicates);

	// Bei Öffnen des Modals die aktuellen Werte laden
	$effect(() => {
		if (open) {
			positions = currentConfig.positions;
			colorCount = currentConfig.colorCount;
			maxAttempts = currentConfig.maxAttempts;
			allowDuplicates = currentConfig.allowDuplicates;
		}
	});

	// Validierung: Ohne Duplikate müssen genug Farben vorhanden sein
	const isValid = $derived(allowDuplicates || colorCount >= positions);

	function handleSave() {
		if (!isValid) return;

		onsave({
			positions,
			colorCount,
			maxAttempts,
			allowDuplicates
		});
		onclose();
	}

	function handleReset() {
		positions = DEFAULT_CONFIG.positions;
		colorCount = DEFAULT_CONFIG.colorCount;
		maxAttempts = DEFAULT_CONFIG.maxAttempts;
		allowDuplicates = DEFAULT_CONFIG.allowDuplicates;
	}
</script>

<Modal {open} title="Spieleinstellungen" {onclose}>
	<div class="space-y-6">
		<!-- Positionen -->
		<div>
			<NumberInput bind:value={positions} min={3} max={6} label="Anzahl Positionen" id="positions" />
			<p class="mt-1 text-xs text-gray-500">Wie viele Farben hat der geheime Code?</p>
		</div>

		<!-- Farben -->
		<div>
			<NumberInput bind:value={colorCount} min={4} max={8} label="Anzahl Farben" id="colorCount" />
			<p class="mt-1 text-xs text-gray-500">Wie viele verschiedene Farben stehen zur Auswahl?</p>
		</div>

		<!-- Versuche -->
		<div>
			<NumberInput
				bind:value={maxAttempts}
				min={5}
				max={15}
				label="Maximale Versuche"
				id="maxAttempts"
			/>
			<p class="mt-1 text-xs text-gray-500">Wie viele Versuche hast du?</p>
		</div>

		<!-- Duplikate -->
		<div class="flex items-center gap-3">
			<input
				type="checkbox"
				id="allowDuplicates"
				class="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				bind:checked={allowDuplicates}
			/>
			<label for="allowDuplicates" class="text-sm font-medium text-gray-700">
				Farbwiederholung erlauben
			</label>
		</div>
		<p class="text-xs text-gray-500 -mt-4">
			Wenn aktiviert, kann eine Farbe mehrfach im Code vorkommen.
		</p>

		<!-- Validierungsfehler -->
		{#if !isValid}
			<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
				Ohne Farbwiederholung benötigst du mindestens {positions} Farben!
			</div>
		{/if}
	</div>

	{#snippet footer()}
		<div class="flex gap-2 justify-end">
			<Button variant="secondary" onclick={handleReset}>
				Zurücksetzen
			</Button>
			<Button variant="primary" onclick={handleSave} disabled={!isValid}>
				Speichern & Neues Spiel
			</Button>
		</div>
	{/snippet}
</Modal>
