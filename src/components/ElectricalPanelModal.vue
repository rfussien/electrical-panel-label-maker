<template>
  <div class="pa-4 text-center d-print-none">
    <v-dialog
      v-model="dialog"
      max-width="600"
      @update:model-value="handleDialogChange"
    >
      <v-card
        prepend-icon="mdi-grid"
        :title="t('modal.title')"
      >
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="selectedRow"
                :items="rowOptions"
                :label="t('modal.selectRow')"
                @update:model-value="updateModuleOptions"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="selectedModule"
                :items="moduleOptions"
                :label="t('modal.selectModule')"
                :disabled="!selectedRow"
              ></v-select>
            </v-col>
          </v-row>
          
          <v-divider class="my-4"></v-divider>
          
          <v-row v-if="editableModule">
            <v-col cols="12">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel :title="t('modal.selectIcon') || 'Select Icon'">
                  <v-expansion-panel-text>
                    <IconSelector
                      v-model="selectedIconFile"
                      :icons="availableIcons"
                    />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-text-field
                v-model="editableModule.description"
                :label="t('modal.description') || 'Description'"
                :hint="t('modal.descriptionHint') || 'Enter module description'"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-combobox
                v-model="editableModule.location"
                :items="locationOptions"
                item-title="title"
                item-value="value"
                :label="t('modal.location') || 'Location'"
                clearable
                :hint="t('modal.locationHint') || 'Select or enter a custom location'"
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="editableModule.size"
                :items="[1, 2, 3, 4, 5, 6]"
                :label="t('modal.size') || 'Size'"
                :hint="t('modal.sizeHint') || 'Number of places the module occupies'"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-card variant="outlined" class="pa-2 mt-2">
                <div class="text-subtitle-1 mb-2">{{ t('modal.preview') || 'Preview' }}</div>
                <div class="d-flex justify-center">
                  <ElectricalPanelModule
                    :rowIndex="selectedRow || 0"
                    :moduleIndex="selectedModule || 0"
                    :icon="selectedIconFile"
                    :description="editableModule.description"
                    :location="getLocationDisplayValue(editableModule.location)"
                    :size="editableModule.size"
                  />
                </div>
              </v-card>
            </v-col>
          </v-row>
          
          <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-4"
          >
            {{ t('modal.selectToEdit') || 'Select a row and module to edit' }}
          </v-alert>
        </v-card-text>
        
        <v-card-actions>
          <v-btn
            color="error"
            variant="text"
            @click="resetModuleFields"
            :disabled="!editableModule"
          >
            {{ t('modal.reset') || 'Reset Fields' }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="saveChanges"
            :disabled="!editableModule"
          >
            {{ t('modal.save') || 'Save Changes' }}
          </v-btn>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="dialog = false"
          >
            {{ t('modal.close') || 'Close' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import IconSelector from './IconSelector.vue'
import ElectricalPanelModule from './ElectricalPanelModule.vue'
import type { Module, PanelRow } from '@/types'
import { moduleTypes } from '@/data/moduleTypes'
import { locations } from '@/data/locations'

const { t } = useI18n()

const props = defineProps<{
  panelRows: PanelRow[];
  initialRowIndex?: number;
  initialModuleIndex?: number;
}>()

const emit = defineEmits<{
  'update:panelRows': [panelRows: PanelRow[]]
  'dialogClosed': []
}>()

// Get all available icons from moduleTypes
const availableIcons = computed(() => moduleTypes.map(type => type.icon))

const dialog = ref(false)
const selectedRow = ref<number | null>(null)
const selectedModule = ref<number | null>(null)
const selectedIconFile = ref<string>('')

// Editable module data
const editableModule = ref<Module>({
  id: 0,
  icon: '',
  description: '',
  size: 1,
  location: ''
})

// Watch for initialRowIndex and initialModuleIndex changes to open the dialog
let isOpeningFromProps = false;

watch(() => [props.initialRowIndex, props.initialModuleIndex], ([rowIndex, moduleIndex]) => {
  console.log('Modal received indices:', { rowIndex, moduleIndex });
  if (rowIndex !== undefined && moduleIndex !== undefined) {
    console.log('Panel rows in modal:', props.panelRows);
    console.log('Row data in modal:', props.panelRows[rowIndex]);
    console.log('Module data in modal:', props.panelRows[rowIndex]?.modules[moduleIndex]);
    
    isOpeningFromProps = true; // Set flag to prevent reset
    
    // Only proceed if the dialog is not already open with the same module
    // or if the dialog is closed
    if (!dialog.value || 
        selectedRow.value !== props.panelRows[rowIndex].id || 
        selectedModule.value !== props.panelRows[rowIndex].modules[moduleIndex].id) {
      
      selectedRow.value = props.panelRows[rowIndex].id
      selectedModule.value = props.panelRows[rowIndex].modules[moduleIndex].id
      console.log('Selected row ID:', selectedRow.value);
      console.log('Selected module ID:', selectedModule.value);
      
      // Set the editable module directly to avoid relying on updateModuleOptions
      const module = props.panelRows[rowIndex].modules[moduleIndex];
      editableModule.value = { ...module };
      selectedIconFile.value = module.icon || '';
      console.log('Set editable module directly:', editableModule.value);
      
      dialog.value = true
    } else {
      console.log('Dialog already open with the same module, refreshing data');
      // Refresh the editable module data
      const module = props.panelRows[rowIndex].modules[moduleIndex];
      editableModule.value = { ...module };
      selectedIconFile.value = module.icon || '';
    }
    
    // Reset flag after a short delay to allow watch to complete
    setTimeout(() => {
      isOpeningFromProps = false;
    }, 100);
  }
}, { deep: true })

// Reset selectedModule when selectedRow changes
watch(selectedRow, () => {
  // Only reset if not opening from props
  if (!isOpeningFromProps) {
    console.log('Resetting module selection because row changed (not from props)');
    selectedModule.value = null
    resetModuleFields()
    updateModuleOptions()
  } else {
    console.log('Skipping reset because dialog is opening from props');
  }
})

// Function to update the module options when a row and module are selected
function updateModuleOptions() {
  console.log('updateModuleOptions called with:', { selectedRow: selectedRow.value, selectedModule: selectedModule.value });
  
  if (!selectedRow.value || !selectedModule.value) {
    console.log('No selected row or module');
    return
  }
  
  const row = props.panelRows.find(r => r.id === selectedRow.value)
  console.log('Found row:', row);
  if (!row) return
  
  const module = row.modules.find(m => m.id === selectedModule.value)
  console.log('Found module:', module);
  if (!module) return
  
  // Clone the module to avoid direct mutation
  editableModule.value = { ...module }
  selectedIconFile.value = module.icon || ''
  console.log('Set editable module:', editableModule.value);
  console.log('Set selected icon file:', selectedIconFile.value);
}

// Define interface for location options
interface LocationOption {
  title: string;
  value: string;
}

// Get location options from the locations array with translated values
const locationOptions = computed(() => locations.map(location => {
  const key = `locations.${location.key}`;
  return {
    title: t(key),  // Translated text for display
    value: key      // Translation key as value
  };
}))

// Update module options when selectedModule changes
watch(selectedModule, () => {
  if (!selectedRow.value || !selectedModule.value) {
    resetModuleFields()
    return
  }
  
  updateModuleOptions()
})

// Computed properties for the select dropdowns
const rowOptions = computed(() => {
  return props.panelRows.map(row => ({
    title: t('modal.row') + ` ${row.id}`,
    value: row.id
  }))
})

const moduleOptions = computed(() => {
  if (!selectedRow.value) return []
  
  const row = props.panelRows.find(r => r.id === selectedRow.value)
  if (!row) return []
  
  return row.modules.map(module => ({
    title: t('modal.module') + ` ${module.id}`,
    value: module.id
  }))
})

// Function to reset module fields
function resetModuleFields() {
  editableModule.value = {
    id: 0,
    icon: '',
    description: '',
    size: 1,
    location: ''
  }
  selectedIconFile.value = ''
}

// Watch for changes to the selected icon and update the description
watch(selectedIconFile, (newIcon) => {
  if (newIcon && editableModule.value) {
    // Get the module type by icon
    const moduleType = moduleTypes.find(type => type.icon === newIcon)
    if (moduleType) {
      // Use the translated value directly instead of the translation key
      editableModule.value.description = t(`modules.${moduleType.key}`)
    }
  }
})

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

function saveChanges() {
  if (!editableModule.value || !selectedRow.value || !selectedModule.value) return
  
  // Create a deep copy of the panelRows
  const updatedRows = JSON.parse(JSON.stringify(props.panelRows))
  
  // Find the row and module to update
  const rowIndex = updatedRows.findIndex((r: PanelRow) => r.id === (selectedRow.value || 0))
  if (rowIndex === -1) return
  
  const moduleIndex = updatedRows[rowIndex].modules.findIndex((m: Module) => m.id === (selectedModule.value || 0))
  if (moduleIndex === -1) return
  
  // Update the module
  updatedRows[rowIndex].modules[moduleIndex] = {
    ...updatedRows[rowIndex].modules[moduleIndex],
    icon: selectedIconFile.value,
    description: editableModule.value.description,
    location: editableModule.value.location,
    size: editableModule.value.size
  }
  
  // Emit the updated panelRows
  emit('update:panelRows', updatedRows)
  
  // Show success message or close dialog
  dialog.value = false
}

function handleDialogChange(value: boolean) {
  if (!value) { // Dialog is closing
    // Reset the form state
    selectedRow.value = null;
    selectedModule.value = null;
    editableModule.value = {
      id: 0,
      icon: '',
      description: '',
      size: 1,
      location: ''
    }
    selectedIconFile.value = '';
    // Notify parent component
    emit('dialogClosed');
  }
}
</script>
