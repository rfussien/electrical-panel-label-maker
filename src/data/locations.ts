import type { Location } from '@/types';

/**
 * Array of locations available in the application
 * Each location has a key (used for translation) and a name
 */
export const locations: Location[] = [
  { key: 'kitchen', name: 'kitchen' },
  { key: 'livingRoom', name: 'livingRoom' },
  { key: 'bedroom', name: 'bedroom' },
  { key: 'bathroom', name: 'bathroom' },
  { key: 'laundryRoom', name: 'laundryRoom' },
  { key: 'garage', name: 'garage' },
  { key: 'basement', name: 'basement' },
  { key: 'attic', name: 'attic' },
  { key: 'outside', name: 'outside' }
];

/**
 * Helper function to get a location by its key
 */
export function getLocationByKey(key: string): Location | undefined {
  return locations.find(location => location.key === key);
}

/**
 * Helper function to get a location by its name
 */
export function getLocationByName(name: string): Location | undefined {
  return locations.find(location => location.name === name);
}
