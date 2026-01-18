<script setup lang="ts">
import { ref } from 'vue';
import { useServerConnection } from '@/composables/useServerConnection';
import { useModalsStore } from '@/stores/modals';
import type { Strip, StripUpdate, ClientMessage, StripArray } from '@/types/ws-messages';
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectViewport,
} from 'reka-ui';

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
        <SelectRoot v-model="formData.strip_array">
          <SelectTrigger
            class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono flex items-center justify-between"
          >
            <SelectValue placeholder="Select strip array" />
          </SelectTrigger>
          <SelectPortal>
            <SelectContent
              class="bg-panel border border-border-default shadow-lg overflow-hidden"
              :side-offset="5"
            >
              <SelectViewport>
                <SelectItem
                  value="Planned"
                  class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
                >
                  <SelectItemText>Planned</SelectItemText>
                </SelectItem>
                <SelectItem
                  value="Departed"
                  class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
                >
                  <SelectItemText>Departed</SelectItemText>
                </SelectItem>
                <SelectItem
                  value="Arrived"
                  class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
                >
                  <SelectItemText>Arrived</SelectItemText>
                </SelectItem>
                <SelectItem
                  value="Cancelled"
                  class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
                >
                  <SelectItemText>Cancelled</SelectItemText>
                </SelectItem>
              </SelectViewport>
            </SelectContent>
          </SelectPortal>
        </SelectRoot>
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
          <SelectRoot v-model="formData.wake_turbulence">
            <SelectTrigger
              class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono flex items-center justify-between"
            >
              <SelectValue placeholder="Select wake turbulence" />
            </SelectTrigger>
            <SelectPortal>
              <SelectContent
                class="bg-panel border border-border-default shadow-lg overflow-hidden"
                :side-offset="5"
              >
                <SelectViewport>
                  <SelectItem
                    value="L"
                    class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
                  >
                    <SelectItemText>L (Light)</SelectItemText>
                  </SelectItem>
                  <SelectItem
                    value="M"
                    class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
                  >
                    <SelectItemText>M (Medium)</SelectItemText>
                  </SelectItem>
                  <SelectItem
                    value="H"
                    class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
                  >
                    <SelectItemText>H (Heavy)</SelectItemText>
                  </SelectItem>
                  <SelectItem
                    value="J"
                    class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
                  >
                    <SelectItemText>J (Super)</SelectItemText>
                  </SelectItem>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
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
        <SelectRoot v-model="formData.flight_rules">
          <SelectTrigger
            class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono flex items-center justify-between"
          >
            <SelectValue placeholder="Select flight rules" />
          </SelectTrigger>
          <SelectPortal>
            <SelectContent
              class="bg-panel border border-border-default shadow-lg overflow-hidden"
              :side-offset="5"
            >
              <SelectViewport>
                <SelectItem
                  value="IFR"
                  class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
                >
                  <SelectItemText>IFR</SelectItemText>
                </SelectItem>
                <SelectItem
                  value="VFR"
                  class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
                >
                  <SelectItemText>VFR</SelectItemText>
                </SelectItem>
              </SelectViewport>
            </SelectContent>
          </SelectPortal>
        </SelectRoot>
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
