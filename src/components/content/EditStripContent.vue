<script setup lang="ts">
import { ref } from 'vue';
import { useServerConnection } from '@/composables/useServerConnection';
import { useModalsStore } from '@/stores/modals';
import type { Strip, StripUpdate, ClientMessage, StripArray } from '@/types/ws-messages';
import Select from '@/components/primitives/input/select/Select.vue';
import SelectItem from '@/components/primitives/input/select/SelectItem.vue';

interface Props {
  strip: Strip;
  currentArray: StripArray;
  modalKey: string;
}

const props = defineProps<Props>();
const { send } = useServerConnection();
const modalsStore = useModalsStore();

const formData = ref({
  strip_array: props.currentArray,
  callsign: props.strip.callsign,
  aircraft_type: props.strip.aircraft_type,
  wake_turbulence: props.strip.wake_turbulence,
  departure_aerodrome: props.strip.departure_aerodrome,
  destination_aerodrome: props.strip.destination_aerodrome,
  departure_time: props.strip.departure_time,
  cruising_speed: props.strip.cruising_speed,
  cruising_level: props.strip.cruising_level,
  flight_rules: props.strip.flight_rules,
  route: props.strip.route,
  alternate_aerodrome: props.strip.alternate_aerodrome || '',
  total_eet: props.strip.total_eet,
});

const handleSubmit = (event: Event) => {
  event.preventDefault();

  const changes: StripUpdate = {
    callsign:
      formData.value.callsign !== props.strip.callsign ? formData.value.callsign : undefined,
    aircraft_type:
      formData.value.aircraft_type !== props.strip.aircraft_type
        ? formData.value.aircraft_type
        : undefined,
    wake_turbulence:
      formData.value.wake_turbulence !== props.strip.wake_turbulence
        ? formData.value.wake_turbulence
        : undefined,
    departure_aerodrome:
      formData.value.departure_aerodrome !== props.strip.departure_aerodrome
        ? formData.value.departure_aerodrome
        : undefined,
    destination_aerodrome:
      formData.value.destination_aerodrome !== props.strip.destination_aerodrome
        ? formData.value.destination_aerodrome
        : undefined,
    departure_time:
      formData.value.departure_time !== props.strip.departure_time
        ? formData.value.departure_time
        : undefined,
    cruising_speed:
      formData.value.cruising_speed !== props.strip.cruising_speed
        ? formData.value.cruising_speed
        : undefined,
    cruising_level:
      formData.value.cruising_level !== props.strip.cruising_level
        ? formData.value.cruising_level
        : undefined,
    flight_rules:
      formData.value.flight_rules !== props.strip.flight_rules
        ? formData.value.flight_rules
        : undefined,
    route: formData.value.route !== props.strip.route ? formData.value.route : undefined,
    alternate_aerodrome:
      formData.value.alternate_aerodrome !== (props.strip.alternate_aerodrome || '')
        ? formData.value.alternate_aerodrome
        : undefined,
    total_eet:
      formData.value.total_eet !== props.strip.total_eet ? formData.value.total_eet : undefined,
    target_array:
      formData.value.strip_array !== props.currentArray ? formData.value.strip_array : undefined,
    last_modified: Date.now(),
  };

  const message: ClientMessage = {
    type: 'UpdateStrip',
    strip_id: props.strip.id,
    changes,
  };

  send(JSON.stringify(message));
  modalsStore.closeModal(props.modalKey);
};
</script>

<template>
  <div class="h-full flex flex-col">
    <form @submit="handleSubmit" class="flex-1 overflow-y-auto space-y-3 pr-2">
      <div>
        <label class="text-sm text-primary block mb-1">Strip Array</label>
        <Select v-model="formData.strip_array" placeholder="Select strip array">
          <SelectItem value="Planned">Planned</SelectItem>
          <SelectItem value="Departed">Departed</SelectItem>
          <SelectItem value="Arrived">Arrived</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </Select>
      </div>

      <div>
        <label class="text-sm text-primary block mb-1">Callsign</label>
        <input
          v-model="formData.callsign"
          type="text"
          class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-sm text-primary block mb-1">Aircraft Type</label>
          <input
            v-model="formData.aircraft_type"
            type="text"
            class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono"
            required
          />
        </div>

        <div>
          <label class="text-sm text-primary block mb-1">Wake Turbulence</label>
          <Select v-model="formData.wake_turbulence" placeholder="Select wake turbulence">
            <SelectItem value="L">L (Light)</SelectItem>
            <SelectItem value="M">M (Medium)</SelectItem>
            <SelectItem value="H">H (Heavy)</SelectItem>
            <SelectItem value="J">J (Super)</SelectItem>
          </Select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-sm text-primary block mb-1">Departure Aerodrome</label>
          <input
            v-model="formData.departure_aerodrome"
            type="text"
            class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono uppercase"
            required
            maxlength="4"
          />
        </div>

        <div>
          <label class="text-sm text-primary block mb-1">Destination Aerodrome</label>
          <input
            v-model="formData.destination_aerodrome"
            type="text"
            class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono uppercase"
            required
            maxlength="4"
          />
        </div>
      </div>

      <div>
        <label class="text-sm text-primary block mb-1">Departure Time (DDHHMM)</label>
        <input
          v-model="formData.departure_time"
          type="text"
          class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono"
          required
          maxlength="6"
          pattern="\d{6}"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-sm text-primary block mb-1">Cruising Speed</label>
          <input
            v-model="formData.cruising_speed"
            type="text"
            class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono uppercase"
            required
          />
        </div>

        <div>
          <label class="text-sm text-primary block mb-1">Cruising Level</label>
          <input
            v-model="formData.cruising_level"
            type="text"
            class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono uppercase"
            required
          />
        </div>
      </div>

      <div>
        <label class="text-sm text-primary block mb-1">Flight Rules</label>
        <Select v-model="formData.flight_rules" placeholder="Select flight rules">
          <SelectItem value="IFR">IFR</SelectItem>
          <SelectItem value="VFR">VFR</SelectItem>
        </Select>
      </div>

      <div>
        <label class="text-sm text-primary block mb-1">Route</label>
        <textarea
          v-model="formData.route"
          class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono resize-none"
          rows="3"
          required
        ></textarea>
      </div>

      <div>
        <label class="text-sm text-primary block mb-1">Alternate Aerodrome (Optional)</label>
        <input
          v-model="formData.alternate_aerodrome"
          type="text"
          class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono uppercase"
          maxlength="4"
        />
      </div>

      <div>
        <label class="text-sm text-primary block mb-1">Total EET</label>
        <input
          v-model="formData.total_eet"
          type="text"
          class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono"
          required
        />
      </div>

      <div
        class="flex justify-end gap-2 pt-3 border-t border-border-default sticky bottom-0 bg-panel"
      >
        <button
          type="button"
          @click="modalsStore.closeModal(modalKey)"
          class="px-3 py-1.5 text-sm text-secondary hover:text-primary border border-border-default hover:border-accent transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-3 py-1.5 text-sm bg-accent text-primary border border-accent hover:brightness-110 transition-all"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>
