<script setup lang="ts">
import ElectricalPanelModule from './ElectricalPanelModule.vue'
import type { Module, PanelRow } from '@/types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ 
  msg?: string;
  panelRows: PanelRow[];
}>()

const emit = defineEmits<{
  'update:panelRows': [panelRows: PanelRow[]]
  'deleteRow': [rowIndex: number]
  'addRow': []
  'editModule': [rowIndex: number, moduleIndex: number]
}>()

function deleteRow(rowIndex: number) {
  // Only emit the event, let the parent component handle the actual deletion
  emit('deleteRow', rowIndex)
}

function addRow() {
  // Only emit the event, let the parent component handle the actual addition
  emit('addRow')
}

function handleModuleEdit(rowIndex: number, moduleIndex: number) {
  emit('editModule', rowIndex, moduleIndex)
}

// Compute which modules should be displayed based on their size and position
const visibleModules = computed(() => {
  const result = new Map<string, boolean>();
  
  props.panelRows.forEach(row => {
    row.modules.forEach(module => {
      const key = `${row.id}-${module.id}`;
      
      // Always display the first module in its position
      if (module.id === 1) {
        result.set(key, true);
        return;
      }
      
      // For modules after the first one, check if they are hidden by previous modules
      const previousModules = row.modules.filter(m => m.id < module.id);
      
      // Check if any previous module extends to or beyond this module's position
      for (const prevModule of previousModules) {
        const prevSize = prevModule.size || 1;
        // If a previous module's end position is at or beyond this module's position, hide this module
        if (prevModule.id + prevSize - 1 >= module.id) {
          result.set(key, false);
          return;
        }
      }
      
      result.set(key, true);
    });
  });
  
  return result;
});

function shouldDisplayModule(rowId: number, moduleId: number) {
  return visibleModules.value.get(`${rowId}-${moduleId}`) ?? false;
}

// Function to get the display value for a location
function getLocationDisplayValue(location: any): string {
  if (!location) return '';
  
  if (typeof location === 'string') {
    // If it's a translation key, translate it
    if (location.startsWith('locations.')) {
      return t(location);
    }
    // Otherwise return the string as is
    return location;
  }
  
  // If it's an object with a title property, use that
  if (typeof location === 'object' && location !== null) {
    if ('title' in location) return location.title;
    if ('text' in location) return location.text;
    if ('value' in location && typeof location.value === 'string') {
      if (location.value.startsWith('locations.')) {
        return t(location.value);
      }
      return location.value;
    }
  }
  
  // Fallback to empty string
  return '';
}

// Drag and drop functionality
function onDragStart(event: DragEvent, rowIndex: number, moduleIndex: number) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify({ rowIndex, moduleIndex }));
  }
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

function onDrop(event: DragEvent, targetRowIndex: number, targetModuleIndex: number) {
  event.preventDefault();
  
  if (!event.dataTransfer) return;
  
  const data = JSON.parse(event.dataTransfer.getData('application/json'));
  const { rowIndex: sourceRowIndex, moduleIndex: sourceModuleIndex } = data;
  
  // Only allow reordering within the same row for now
  if (sourceRowIndex !== targetRowIndex) return;
  if (sourceModuleIndex === targetModuleIndex) return; // No change needed
  
  // Get the source and target row
  const rowIndex = sourceRowIndex - 1; // Convert from 1-based to 0-based index
  const row = props.panelRows[rowIndex];
  
  // Get the source and target modules
  const sourceModuleIdx = row.modules.findIndex(m => m.id === sourceModuleIndex);
  const targetModuleIdx = row.modules.findIndex(m => m.id === targetModuleIndex);
  
  if (sourceModuleIdx === -1 || targetModuleIdx === -1) return;
  
  // Create a deep copy of the row's modules
  const newModules = JSON.parse(JSON.stringify(row.modules));
  
  // Swap the modules (not just their IDs)
  [newModules[sourceModuleIdx], newModules[targetModuleIdx]] = 
    [newModules[targetModuleIdx], newModules[sourceModuleIdx]];
  
  // Create a new array of rows with the updated modules
  const newRows = [...props.panelRows];
  newRows[rowIndex] = { ...row, modules: newModules };
  
  // Update the panel rows
  emit('update:panelRows', newRows);
}
</script>

<template>
  <v-container fluid class="electrical-panel">
    <div 
      v-for="(row, rowIndex) in props.panelRows" 
      :key="row.id"
      class="electrical-panel-row mb-6"
    >
      <div class="row-content">
        <div class="d-flex flex-row">
          <template v-for="module in row.modules" :key="module.id">
            <div 
              v-if="shouldDisplayModule(row.id, module.id)"
              draggable="true"
              @dragstart="onDragStart($event, row.id, module.id)"
              @dragover="onDragOver($event)"
              @drop="onDrop($event, row.id, module.id)"
              class="module-container"
            >
              <ElectricalPanelModule
                :rowIndex="row.id" 
                :moduleIndex="module.id" 
                :icon="module.icon"
                :description="module.description"
                :location="getLocationDisplayValue(module.location)"
                :size="module.size || 1"
                @edit="handleModuleEdit(rowIndex, row.modules.findIndex(m => m.id === module.id))"
              />
            </div>
          </template>
        </div>
        <v-btn 
          class="delete-row-btn d-print-none"
          icon="mdi-delete" 
          color="error"
          size="small"
          variant="flat"
          @click="deleteRow(rowIndex)"
        ></v-btn>
      </div>
    </div>
    <div class="add-row-container d-print-none mt-4">
      <v-btn 
        class="add-row-btn"
        prepend-icon="mdi-plus" 
        color="primary"
        @click="addRow"
      >
        {{ t('addRow') }}
      </v-btn>
    </div>
  </v-container>
</template>

<style scoped>

.electrical-panel {
  width: fit-content;
  margin: 0 auto;
}

.electrical-panel-row {
  position: relative;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.electrical-panel-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.module-container {
  margin: 0px;
}

.delete-row-btn {
  margin: 10px;
  background-color: rgba(244, 67, 54, 0.9) !important;
  color: white !important;
  transition: all 0.2s ease;
  min-width: 36px !important;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.delete-row-btn:hover {
  background-color: rgba(244, 67, 54, 1) !important;
  transform: scale(1.1);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.row-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-row-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.add-row-btn {
  transition: all 0.3s ease;
  border-radius: 28px;
  padding: 0 24px;
}

.add-row-btn:hover {
  transform: scale(1.05);
}

@media print {
  .electrical-panel-row {
    page-break-inside: avoid; /* Prevent rows from breaking across pages */
    break-inside: avoid; /* Modern browsers */
    box-shadow: none !important;
    margin-bottom: 8px;
    transform: none !important;
    border-radius: 0 !important;
    overflow: visible !important;
  }
  
  .delete-row-btn {
    display: none; /* Hide delete buttons when printing */
  }
  
  .v-btn {
    display: none; /* Hide all buttons when printing */
  }
  
  /* Add more space between rows for better readability when printing */
  .electrical-panel {
    width: 100% !important;
    margin: 0 !important;
  }
}
</style>