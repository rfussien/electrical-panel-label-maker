<template>
  <v-responsive class="app-container">
    <v-app :theme="theme">
      <AppBar 
        v-model:theme="theme" 
        :panelRows="panelRows"
        @share="sharePanel"
        @import="handleImport"
      />
      <v-main class="main-content">
        <v-container fluid class="pa-4">
          <v-card class="mx-auto panel-card" elevation="3" max-width="1200">
            <v-card-text>
              <ElectricalPanel
                v-model:panelRows="panelRows"
                @deleteRow="handleDeleteRow"
                @addRow="handleAddRow"
                @editModule="handleEditModule"
              />
            </v-card-text>
          </v-card>
          <ElectricalPanelModal
            v-model:panelRows="panelRows"
            :initialRowIndex="editingRowIndex"
            :initialModuleIndex="editingModuleIndex"
            @dialogClosed="resetEditingIndices"
          />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
// --- Imports ---
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppBar from './components/AppBar.vue'
import ElectricalPanel from './components/ElectricalPanel.vue'
import ElectricalPanelModal from './components/ElectricalPanelModal.vue'
import { defaultPanelRows, createEmptyRow } from './data/panelData'
import type { Module, PanelRow } from '@/types'

// --- Theme Management ---
const theme = ref('light')

// Watch for theme changes and save to localStorage
watch(theme, (newTheme) => {
  localStorage.setItem('preferredTheme', newTheme);
  console.log('Saved theme preference to localStorage:', newTheme);
})

// --- Module Editing State ---
const editingRowIndex = ref<number | undefined>(undefined)
const editingModuleIndex = ref<number | undefined>(undefined)

function handleEditModule(rowIndex: number, moduleIndex: number) {
  console.log(`Editing module at row ${rowIndex}, module index ${moduleIndex}`);
  editingRowIndex.value = rowIndex;
  editingModuleIndex.value = moduleIndex;
}

function resetEditingIndices() {
  editingRowIndex.value = undefined;
  editingModuleIndex.value = undefined;
}

// --- Translation System ---
const { t, locale } = useI18n();

// Load saved language preference from localStorage
onMounted(() => {
  // Load saved language preference from localStorage
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage) {
    locale.value = savedLanguage;
    console.log('Loaded language preference from localStorage:', savedLanguage);
  }

  // Load saved theme preference from localStorage
  const savedTheme = localStorage.getItem('preferredTheme');
  if (savedTheme) {
    theme.value = savedTheme;
    console.log('Loaded theme preference from localStorage:', savedTheme);
  }
  
  // Check for shared data in URL hash fragment
  const hashData = window.location.hash;
  if (hashData && hashData.startsWith('#data=')) {
    try {
      // Extract the base64 encoded data
      const base64Data = hashData.substring(6); // Remove '#data='
      // Decode from base64
      const jsonData = atob(base64Data);
      // Import the data
      if (handleImport(jsonData)) {
        console.log('Successfully loaded panel data from URL hash');
      }
    } catch (error) {
      console.error('Error loading data from URL hash:', error);
      alert(t('alerts.importError'));
    }
  } else {
    // If no data in URL, ensure translations are applied to default data
    updatePanelTranslations();
  }
});

// Define interface for location objects
interface LocationObject {
  value?: string;
  title?: string;
  text?: string;
}

// Function to update translations in panel data when language changes
function updatePanelTranslations() {
  // Create a deep copy of the panel rows
  const updatedRows = JSON.parse(JSON.stringify(panelRows.value));
  
  // Update translations for each module
  updatedRows.forEach((row: PanelRow) => {
    row.modules.forEach((module: Module) => {
      // Check if the module has a description that looks like a translation key
      if (module.description && typeof module.description === 'string' && module.description.startsWith('modules.')) {
        module.description = t(module.description);
      }
      
      // Check if the module has a location that looks like a translation key
      if (module.location) {
        if (typeof module.location === 'string') {
          if (module.location.startsWith('locations.')) {
            module.location = t(module.location);
          }
        } else if (typeof module.location === 'object' && module.location !== null) {
          // Handle location objects
          const locationObj = module.location as LocationObject;
          if (locationObj.value && typeof locationObj.value === 'string' && locationObj.value.startsWith('locations.')) {
            // Convert the object to a string with the translated value
            module.location = t(locationObj.value);
          } else if (locationObj.title) {
            // Use the title directly if it exists
            module.location = locationObj.title;
          }
        }
      }
    });
  });
  
  // Update the panel rows
  panelRows.value = updatedRows;
}

// Watch for language changes
watch(locale, () => {
  updatePanelTranslations();
});

// --- Panel Data Management ---
// Initialize panel rows with default data
const panelRows = ref<PanelRow[]>(JSON.parse(JSON.stringify(defaultPanelRows)));

// --- Row Management Functions ---
function handleDeleteRow(rowIndex: number) {
  console.log(`Deleting row at index ${rowIndex}`);
  
  // Create a new array without the deleted row
  const updatedRows = [...panelRows.value];
  updatedRows.splice(rowIndex, 1);
  
  // Reassign IDs to maintain sequential ordering
  updatedRows.forEach((row, index) => {
    row.id = index + 1;
  });
  
  // Update the panel rows
  panelRows.value = updatedRows;
  
  // Reset editing indices to avoid editing a non-existent module
  editingRowIndex.value = undefined;
  editingModuleIndex.value = undefined;
}

function handleAddRow() {
  // Calculate the next row ID (should be the length of the array + 1)
  const newRowId = panelRows.value.length + 1;
  
  // Create a new row using the template function
  const newRow = createEmptyRow(newRowId);
  
  // Add the new row to the panel rows
  panelRows.value = [...panelRows.value, newRow];
  
  // Apply translations to the new row
  updatePanelTranslations();
  
  console.log(`New row ${newRowId} added`);
}

// --- Import/Export Functions ---
function handleImport(data: string) {
  if (data) {
    try {
      // Try to parse the JSON data
      const parsedData = JSON.parse(data);
      
      // Validate that it's an array
      if (Array.isArray(parsedData)) {
        // Validate each row has the required structure
        const isValid = parsedData.every((row: any) => {
          return typeof row.id === 'number' && 
                 Array.isArray(row.modules) &&
                 row.modules.every((module: any) => typeof module.id === 'number');
        });
        
        if (isValid) {
          // Update the panelRows with the loaded data
          panelRows.value = parsedData;
          
          // Apply translations to the imported data
          updatePanelTranslations();
          
          // Show success message
          alert(t('alerts.importSuccess'));
          return true;
        }
      }
      
      // If we get here, the data is invalid
      alert(t('alerts.importError'));
    } catch (error) {
      console.error('Error parsing imported data:', error);
      alert(t('alerts.importError'));
    }
  }
  
  return false;
}

function sharePanel() {
  // Create a URL-friendly representation of the panel data
  const panelData = JSON.stringify(panelRows.value);
  
  // Use a more efficient encoding by compressing the data
  // First, convert to base64 to make it URL-safe
  const base64Data = btoa(panelData);
  
  // Create a URL with the encoded data using a hash fragment instead of a query parameter
  // This avoids Vite's URL length limitations and server-side processing
  const url = `${window.location.origin}${window.location.pathname}#data=${base64Data}`;
  
  // Copy the URL to the clipboard
  navigator.clipboard.writeText(url)
    .then(() => {
      alert(t('alerts.shareSuccess'));
    })
    .catch(err => {
      console.error('Could not copy URL: ', err);
      alert(t('alerts.shareError'));
    });
}
</script>

<style>
.app-container {
  min-height: 100vh;
}

.main-content {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 64px);
}

.panel-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.panel-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

/* Dark theme overrides */
.v-theme--dark .main-content {
  background: linear-gradient(135deg, #1e1e2f 0%, #2d3748 100%);
}

/* Print styles */
@media print {
  .main-content {
    background: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .panel-card {
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .v-card-text {
    padding: 0 !important;
  }
  
  .v-container {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
  }
}
</style>
