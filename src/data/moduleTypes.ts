import type { ModuleType } from '@/types';

/**
 * Array of module types available in the application
 * Each module type has a key (used for translation) and an icon filename
 */
export const moduleTypes: ModuleType[] = [
  { key: 'air_conditioning', icon: 'air_conditioning.svg' },
  { key: 'alarm', icon: 'alarm.svg' },
  { key: 'automatic_gardening', icon: 'automatic_gardening.svg' },
  { key: 'bell', icon: 'bell.svg' },
  { key: 'blind', icon: 'blind.svg' },
  { key: 'box_internet', icon: 'box_internet.svg' },
  { key: 'camera', icon: 'camera.svg' },
  { key: 'ceiling_fan', icon: 'ceiling_fan.svg' },
  { key: 'contactor', icon: 'contactor.svg' },
  { key: 'cooktop', icon: 'cooktop.svg' },
  { key: 'daynight_contactor', icon: 'daynight_contactor.svg' },
  { key: 'differential_switch', icon: 'differential_switch.svg' },
  { key: 'dimmer', icon: 'dimmer.svg' },
  { key: 'dishwasher', icon: 'dishwasher.svg' },
  { key: 'dressing', icon: 'dressing.svg' },
  { key: 'electric_water_heater', icon: 'electric_water_heater.svg' },
  { key: 'electrical_heating', icon: 'electrical_heating.svg' },
  { key: 'electrical_scooter', icon: 'electrical_scooter.svg' },
  { key: 'electrical_vehicle', icon: 'electrical_vehicle.svg' },
  { key: 'engine', icon: 'engine.svg' },
  { key: 'fire_alarm', icon: 'fire_alarm.svg' },
  { key: 'floor_heating', icon: 'floor_heating.svg' },
  { key: 'garage_door', icon: 'garage_door.svg' },
  { key: 'gas_heating', icon: 'gas_heating.svg' },
  { key: 'gate', icon: 'gate.svg' },
  { key: 'group', icon: 'group.svg' },
  { key: 'heat_pump', icon: 'heat_pump.svg' },
  { key: 'hifi', icon: 'hifi.svg' },
  { key: 'home_cinema', icon: 'home_cinema.svg' },
  { key: 'horn', icon: 'horn.svg' },
  { key: 'lightning_protection', icon: 'lightning_protection.svg' },
  { key: 'lights', icon: 'lights.svg' },
  { key: 'microwave_oven', icon: 'microwave_oven.svg' },
  { key: 'module_ip', icon: 'module_ip.svg' },
  { key: 'outdoor_lighting', icon: 'outdoor_lighting.svg' },
  { key: 'oven', icon: 'oven.svg' },
  { key: 'pc', icon: 'pc.svg' },
  { key: 'printer', icon: 'printer.svg' },
  { key: 'protection_wiser', icon: 'protection_wiser.svg' },
  { key: 'refrigerator', icon: 'refrigerator.svg' },
  { key: 'shower', icon: 'shower.svg' },
  { key: 'shutter', icon: 'shutter.svg' },
  { key: 'socket', icon: 'socket.svg' },
  { key: 'solar_water_heater', icon: 'solar_water_heater.svg' },
  { key: 'timer', icon: 'timer.svg' },
  { key: 'towel_warmer', icon: 'towel_warmer.svg' },
  { key: 'transformer', icon: 'transformer.svg' },
  { key: 'tumble_dryer', icon: 'tumble_dryer.svg' },
  { key: 'tv', icon: 'tv.svg' },
  { key: 'video_projector', icon: 'video_projector.svg' },
  { key: 'vmc', icon: 'vmc.svg' },
  { key: 'washing_machine', icon: 'washing_machine.svg' },
  { key: 'wifi', icon: 'wifi.svg' },
];

/**
 * Helper function to get a module type by its key
 */
export function getModuleTypeByKey(key: string): ModuleType | undefined {
  return moduleTypes.find(type => type.key === key);
}

/**
 * Helper function to get a module type by its icon filename
 */
export function getModuleTypeByIcon(icon: string): ModuleType | undefined {
  return moduleTypes.find(type => type.icon === icon);
}