/**
 * WebSocket message protocol for strip state synchronization
 *
 * TypeScript definitions matching the Rust types in server/src/ws_messages.rs
 * Messages are serialized as JSON over WebSocket.
 */

/**
 * Messages sent from client to server
 */
export type ClientMessage = { type: 'UpdateStrip'; strip_id: string; changes: StripUpdate };

/**
 * Top-level message envelope received over WebSocket
 */
export type ServerMessage =
  | { type: 'FullStateSync'; strips: StripState }
  | { type: 'StripOperation'; operation: StripOperation };

/**
 * Complete strip state organized by lifecycle arrays
 */
export interface StripState {
  planned: Strip[];
  departed: Strip[];
  arrived: Strip[];
  cancelled: Strip[];
}

/**
 * Atomic operations on strips
 * Maps to AFTN message types: FPL→Create, CHG→Update, CNL→Delete, DEP/ARR→Move
 */
export type StripOperation =
  | { type: 'Create'; target_array: StripArray; strip: Strip }
  | { type: 'Update'; strip_id: string; changes: StripUpdate }
  | { type: 'Delete'; strip_id: string }
  | { type: 'Move'; strip_id: string; from: StripArray; to: StripArray };

/**
 * Target array for strip operations
 */
export type StripArray = 'Planned' | 'Departed' | 'Arrived' | 'Cancelled';

/**
 * Flight strip data
 */
export interface Strip {
  /** Unique identifier (UUID) */
  id: string;

  /** Aircraft callsign (e.g., "ABC123") */
  callsign: string;

  /** Aircraft type designator (e.g., "B738") */
  aircraft_type: string;

  /** Wake turbulence category */
  wake_turbulence: string;

  /** Departure aerodrome ICAO code (e.g., "DNSU") */
  departure_aerodrome: string;

  /** Destination aerodrome ICAO code */
  destination_aerodrome: string;

  /** Estimated off-block time (DDHHMM format) */
  departure_time: string;

  /** Cruising speed (e.g., "N0450") */
  cruising_speed: string;

  /** Cruising level (e.g., "F330") */
  cruising_level: string;

  /** Flight rules (IFR/VFR) */
  flight_rules: string;

  /** Route string */
  route: string;

  /** Alternate aerodrome (optional) */
  alternate_aerodrome: string | null;

  /** Estimated elapsed time */
  total_eet: string;

  /** Timestamp of last modification (Unix timestamp in milliseconds) */
  last_modified: number;
}

/**
 * Partial update for strip fields
 * Only specified fields will be updated
 */
export interface StripUpdate {
  callsign?: string;
  aircraft_type?: string;
  wake_turbulence?: string;
  departure_aerodrome?: string;
  destination_aerodrome?: string;
  departure_time?: string;
  cruising_speed?: string;
  cruising_level?: string;
  flight_rules?: string;
  route?: string;
  alternate_aerodrome?: string;
  total_eet?: string;
  last_modified?: number;
  target_array?: StripArray;
}
