// Common types used across the application

export interface ModuleType {
  key: string;
  icon: string;
}

export interface Module {
  id: number;
  icon?: string;
  description?: string;
  location?: string;
  size?: number;
}

export interface PanelRow {
  id: number;
  modules: Module[];
}

export interface Location {
  key: string;
  name: string;
}
