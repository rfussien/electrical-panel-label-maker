import type { PanelRow } from '@/types';

// Default panel data with translation keys
export const defaultPanelRows: PanelRow[] = [
  // Row 1
  {
    id: 1,
    modules:[
      {
        id: 1,
        icon: 'differential_switch.svg',
        description: 'modules.differential_switch',
        size: 2
      },
      {
        id: 3,
        icon: 'oven.svg',
        description: 'modules.oven',
        location: 'locations.kitchen',
        size: 1
      },
      {
        id: 4,
        icon: 'socket.svg',
        description: 'modules.socket',
        size: 1
      },
      {
        id: 5,
        icon: 'socket.svg',
        description: 'modules.socket',
        size: 1
      },
      {
        id: 6,
        icon: 'lights.svg',
        description: 'modules.lights',
        size: 1
      },
      ...Array.from({ length: 7 }, (_, i) => ({
        id: i + 7,
        size: 1
      }))
    ]
  },
  // Row 2
  {
    id: 2,
    modules:[
      {
        id: 1,
        icon: 'differential_switch.svg',
        description: 'modules.differential_switch',
        size: 2
      },
      {
        id: 3,
        icon: 'dishwasher.svg',
        description: 'modules.dishwasher',
        location: 'locations.kitchen',
        size: 1
      },
      {
        id: 4,
        icon: 'socket.svg',
        description: 'modules.socket',
        size: 1
      },
      {
        id: 5,
        icon: 'lights.svg',
        description: 'modules.lights',
        size: 1
      },
      ...Array.from({ length: 8 }, (_, i) => ({
        id: i + 6,
        size: 1
      }))
    ]
  },
  // Row 3
  {
    id: 3,
    modules:[
      {
        id: 1,
        icon: 'differential_switch.svg',
        description: 'modules.differential_switch',
        size: 2
      },
      {
        id: 3,
        icon: 'cooktop.svg',
        description: 'modules.cooktop',
        location: 'locations.kitchen',
        size: 1
      },
      {
        id: 4,
        icon: 'washing_machine.svg',
        description: 'modules.washing_machine',
        location: 'locations.laundryRoom',
        size: 1
      },
      {
        id: 5,
        icon: 'socket.svg',
        description: 'modules.socket',
        size: 1
      },
      {
        id: 6,
        icon: 'lights.svg',
        description: 'modules.lights',
        size: 1
      },
      ...Array.from({ length: 7 }, (_, i) => ({
        id: i + 7,
        size: 1
      }))
    ]
  }
];

// Default empty row template
export function createEmptyRow(rowId: number): PanelRow {
  return {
    id: rowId,
    modules: [
      {
        id: 1,
        icon: 'differential_switch.svg',
        description: 'modules.differential_switch',
        size: 2
      },
      ...Array.from({ length: 11 }, (_, i) => ({
        id: i + 3,
        size: 1
      }))
    ]
  };
}
