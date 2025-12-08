<script setup lang="ts">
import { ref, computed } from 'vue'
import Panel from '@/components/Panel.vue'
import Group from '@/components/Group.vue'
import FlightStrip from '@/components/FlightStrip.vue'
import { useLayoutStore } from '@/stores/layout'

interface Props {
  title: string
  panelId: string
}

const props = defineProps<Props>()

const layoutStore = useLayoutStore()

interface FlightStripData {
  id: string
  callsign: string
  flightNumber: string
  aircraftType: string
  registration: string
  adep: string
  ades: string
  equipmentCodes?: string[]
  count?: number
}

const flightStrips = ref<FlightStripData[]>([
  {
    id: '1',
    callsign: 'AAL123',
    flightNumber: 'A1234',
    aircraftType: 'B738/M',
    registration: 'N12345',
    adep: 'KJFK',
    ades: 'KLAX',
    equipmentCodes: ['W', '8', 'P', '1']
  },
  {
    id: '2',
    callsign: 'DAL456',
    flightNumber: 'D5678',
    aircraftType: 'A320/M',
    registration: 'N67890',
    adep: 'KATL',
    ades: 'KORD',
    equipmentCodes: ['W', '8', 'P', '2']
  },
  {
    id: '3',
    callsign: 'UAL789',
    flightNumber: 'U9012',
    aircraftType: 'B77W/H',
    registration: 'N24680',
    adep: 'KSFO',
    ades: 'KEWR',
    equipmentCodes: ['W', '8', 'P', '1']
  },
  {
    id: '4',
    callsign: 'SWA321',
    flightNumber: 'S3456',
    aircraftType: 'B737/M',
    registration: 'N13579',
    adep: 'KLAS',
    ades: 'KPHX',
    equipmentCodes: ['W', '8', 'P', '3']
  },
  {
    id: '5',
    callsign: 'JBU567',
    flightNumber: 'J7890',
    aircraftType: 'A321/M',
    registration: 'N86420',
    adep: 'KJFK',
    ades: 'KMCO',
    equipmentCodes: ['W', '8', 'P', '1']
  }
])

function handleClose() {
  layoutStore.closePanel(props.panelId)
}

const groupId = computed(() => `${props.panelId}-group`)
</script>

<template>
  <Panel :title="title" :panel-id="panelId" :has-group="true" @close="handleClose">
    <Group
      :group-id="groupId"
      direction="vertical"
    >
      <vstack gap="1">
        <FlightStrip
          v-for="strip in flightStrips"
          :key="strip.id"
          :strip-id="`${panelId}-strip-${strip.id}`"
          :callsign="strip.callsign"
          :flight-number="strip.flightNumber"
          :aircraft-type="strip.aircraftType"
          :registration="strip.registration"
          :adep="strip.adep"
          :ades="strip.ades"
          :equipment-codes="strip.equipmentCodes"
          :count="strip.count"
        />
      </vstack>
    </Group>
  </Panel>
</template>
