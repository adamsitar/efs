import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Strip, StripState, StripArray, StripUpdate } from '@/types/ws-messages'

/**
 * Pinia store for managing flight strip state
 * Maintains four reactive arrays corresponding to strip lifecycle stages
 */
export const useStripsStore = defineStore('strips', () => {
  // Reactive state for each strip array
  const planned = ref<Strip[]>([])
  const departed = ref<Strip[]>([])
  const arrived = ref<Strip[]>([])
  const cancelled = ref<Strip[]>([])

  /**
   * Helper function to get the appropriate array by name
   */
  function getArray(arrayName: StripArray) {
    switch (arrayName) {
      case 'Planned':
        return planned.value
      case 'Departed':
        return departed.value
      case 'Arrived':
        return arrived.value
      case 'Cancelled':
        return cancelled.value
    }
  }

  /**
   * Helper function to find which array contains a strip with the given ID
   * Returns both the array name and the strip index, or null if not found
   */
  function findStripLocation(stripId: string): { array: StripArray; index: number } | null {
    const arrays: { name: StripArray; ref: Strip[] }[] = [
      { name: 'Planned', ref: planned.value },
      { name: 'Departed', ref: departed.value },
      { name: 'Arrived', ref: arrived.value },
      { name: 'Cancelled', ref: cancelled.value },
    ]

    for (const { name, ref: array } of arrays) {
      const index = array.findIndex((strip) => strip.id === stripId)
      if (index !== -1) {
        return { array: name, index }
      }
    }

    return null
  }

  /**
   * Replaces all strip arrays with new state
   * Used when receiving a full state sync from the server
   */
  function handleFullStateSync(state: StripState) {
    planned.value = state.planned
    departed.value = state.departed
    arrived.value = state.arrived
    cancelled.value = state.cancelled
  }

  /**
   * Adds a new strip to the specified array
   */
  function handleCreate(targetArray: StripArray, strip: Strip) {
    const array = getArray(targetArray)
    array.push(strip)
  }

  /**
   * Updates fields on an existing strip
   * Only updates fields that are present in the changes object
   */
  function handleUpdate(stripId: string, changes: StripUpdate) {
    const location = findStripLocation(stripId)
    if (!location) {
      console.warn(`[StripsStore] Cannot update strip ${stripId}: not found`)
      return
    }

    const array = getArray(location.array)
    const strip = array[location.index]

    // Apply only the fields that are present in the changes object
    Object.assign(strip, changes)
  }

  /**
   * Removes a strip from all arrays
   */
  function handleDelete(stripId: string) {
    const location = findStripLocation(stripId)
    if (!location) {
      console.warn(`[StripsStore] Cannot delete strip ${stripId}: not found`)
      return
    }

    const array = getArray(location.array)
    array.splice(location.index, 1)
  }

  /**
   * Moves a strip from one array to another
   */
  function handleMove(stripId: string, from: StripArray, to: StripArray) {
    const location = findStripLocation(stripId)
    if (!location) {
      console.warn(`[StripsStore] Cannot move strip ${stripId}: not found`)
      return
    }

    // Verify the strip is in the expected source array
    if (location.array !== from) {
      console.warn(
        `[StripsStore] Strip ${stripId} is in ${location.array}, not ${from} as expected`
      )
      return
    }

    const sourceArray = getArray(from)
    const targetArray = getArray(to)

    // Remove from source and add to target
    const [strip] = sourceArray.splice(location.index, 1)
    targetArray.push(strip)
  }

  return {
    // State
    planned,
    departed,
    arrived,
    cancelled,

    // Actions
    handleFullStateSync,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleMove,
  }
})
