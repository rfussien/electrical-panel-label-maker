<template>
  <div class="icon-selector">
    <div class="d-flex align-center mb-2">
      <v-text-field
        v-model="search"
        :label="t('iconSelector.searchIcons')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        class="flex-grow-1"
        hide-details
      ></v-text-field>
      <v-btn
        v-if="modelValue"
        icon="mdi-close"
        size="small"
        class="ml-2"
        @click="$emit('update:modelValue', '')"
        variant="outlined"
      ></v-btn>
    </div>
    
    <div class="icon-grid">
      <div 
        v-for="icon in filteredIcons" 
        :key="icon"
        class="icon-item"
        :class="{ 'selected': modelValue === icon }"
        @click="$emit('update:modelValue', icon)"
      >
        <img :src="getIconPath(icon)" :alt="icon" class="icon-image" />
        <div class="icon-name">{{ getTranslatedIconName(icon) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  modelValue: string;
  icons: string[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const search = ref('');

const filteredIcons = computed(() => {
  if (!search.value) {
    return props.icons;
  }
  
  const searchTerm = search.value.toLowerCase();
  return props.icons.filter(icon => {
    const formattedName = formatIconName(icon).toLowerCase();
    const translatedName = getTranslatedIconName(icon).toLowerCase();
    return formattedName.includes(searchTerm) || translatedName.includes(searchTerm);
  });
});

function getIconPath(icon: string): string {
  return `./icons/modules/${icon}`;
}

function getTranslatedIconName(filename: string): string {
  // Remove the .svg extension
  const name = filename.replace('.svg', '');
  
  // Try to find a translation for this icon
  const translationKey = `modules.${name}`;
  const translation = t(translationKey);
  
  // If the translation is the same as the key, it means no translation was found
  if (translation === translationKey) {
    return formatIconName(filename);
  }
  
  return translation;
}

function formatIconName(filename: string): string {
  // Remove the .svg extension
  const name = filename.replace('.svg', '');
  
  // Replace underscores with spaces and capitalize each word
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
}
</script>

<style scoped>
.icon-selector {
  max-height: 300px;
  overflow-y: auto;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.icon-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.icon-item.selected {
  background-color: rgba(var(--v-theme-primary), 0.1);
  outline: 2px solid rgb(var(--v-theme-primary));
}

.icon-image {
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
}

.icon-name {
  font-size: 10px;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
