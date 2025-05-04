<template>
  <v-app-bar class="d-print-none">
    <v-app-bar-nav-icon icon="mdi-lightning-bolt"></v-app-bar-nav-icon>
    <v-app-bar-title>{{ $t('appTitle') }}</v-app-bar-title>
    
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn 
          icon 
          v-bind="props" 
          :title="$t('tooltips.language')"
        >
          <v-icon color="grey-darken-1">mdi-translate</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="lang in availableLanguages"
          :key="lang.code"
          :value="lang.code"
          @click="changeLanguage(lang.code)"
        >
          <v-list-item-title>
            {{ lang.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    
    <input
      type="file"
      ref="fileInput"
      accept=".json"
      style="display: none"
      @change="handleFileUpload"
    />
    
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn icon @click="triggerFileInput" v-bind="props">
          <v-icon color="grey-darken-1">mdi-upload</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('tooltips.import') }}</span>
    </v-tooltip>
    
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn icon @click="downloadAsJson" v-bind="props">
          <v-icon color="grey-darken-1">mdi-download</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('tooltips.download') }}</span>
    </v-tooltip>
    
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn icon @click="sharePanel" v-bind="props">
          <v-icon color="grey-darken-1">mdi-share-variant</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('tooltips.share') }}</span>
    </v-tooltip>

    <v-btn icon @click="printPanel">
      <v-icon color="grey-darken-1">mdi-printer</v-icon>
    </v-btn>

    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn icon href="https://github.com/rfussien/electrical-panel-label-maker" target="_blank" v-bind="props">
          <v-icon color="grey-darken-1">mdi-github</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('tooltips.github') }}</span>
    </v-tooltip>

    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn icon @click="toggleTheme" v-bind="props">
          <v-icon color="grey-darken-1">{{ theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('tooltips.theme') }}</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n';

const { t, locale, availableLocales } = useI18n();

const props = defineProps<{
  theme: string;
  panelRows: any[];
}>()

const emit = defineEmits<{
  'update:theme': [value: string];
  'share': [];
  'import': [data: string];
}>()

const fileInput = ref<HTMLInputElement | null>(null);

// Map locale codes to display names
const availableLanguages = computed(() => {
  return availableLocales.map(code => {
    const names = {
      en: 'English',
      fr: 'Français',
      de: 'Deutsch',
      es: 'Español'
    };
    return {
      code,
      name: names[code as keyof typeof names] || code
    };
  });
});

// Computed properties for translations
const appTitle = computed(() => {
  return t('appTitle');
});

const tooltips = computed(() => {
  return {
    import: t('tooltips.import'),
    download: t('tooltips.download'),
    share: t('tooltips.share'),
    print: t('tooltips.print'),
    theme: t('tooltips.theme'),
    language: t('tooltips.language'),
    github: t('tooltips.github')
  };
});

// Methods
function changeLanguage(lang: string) {
  locale.value = lang;
  // Save language preference to localStorage
  localStorage.setItem('preferredLanguage', lang);
}

function toggleTheme() {
  const newTheme = props.theme === 'light' ? 'dark' : 'light'
  emit('update:theme', newTheme)
}

function sharePanel() {
  emit('share')
}

function printPanel() {
  window.print()
}

function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) {
    return;
  }
  
  const file = target.files[0];
  const reader = new FileReader();
  
  reader.onload = (e) => {
    if (e.target && typeof e.target.result === 'string') {
      try {
        // Parse the JSON data
        const data = e.target.result;
        
        // Emit the data to the parent component
        emit('import', data);
        
        // Reset the file input
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert(t('alerts.importError'));
      }
    }
  };
  
  reader.onerror = () => {
    console.error('Error reading file');
    alert(t('alerts.importError'));
  };
  
  reader.readAsText(file);
}

function downloadAsJson() {
  try {
    // Create a JSON string from the panel rows
    const jsonData = JSON.stringify(props.panelRows, null, 2);
    
    // Create a blob from the JSON string
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `electrical-panel-config-${new Date().toISOString().split('T')[0]}.json`;
    
    // Append the link to the document
    document.body.appendChild(link);
    
    // Click the link to trigger the download
    link.click();
    
    // Remove the link from the document
    document.body.removeChild(link);
    
    // Revoke the URL to free up memory
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading configuration:', error);
    alert(t('alerts.downloadError'));
  }
}
</script>

<style scoped>
.v-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .v-app-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.v-btn {
  margin-right: 8px;
}

@media print {
  .d-print-none {
    display: none !important;
  }
}
</style>
