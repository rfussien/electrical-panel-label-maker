<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  rowIndex: number;
  moduleIndex: number;
  icon?: string;
  description?: string;
  location?: string;
  size?: number;
}>()

const emit = defineEmits<{
  'edit': [rowIndex: number, moduleIndex: number]
}>()

function handleEdit() {
  emit('edit', props.rowIndex, props.moduleIndex)
}

const iconSrc = computed(() => {
  if (!props.icon) return '';
  if (props.icon.endsWith('.svg')) {
    return `./icons/modules/${props.icon}`;
  }
  return props.icon;
});

const moduleWidth = computed(() => {
  // Default size is 1 if not specified
  const size = props.size || 1;
  // Valid sizes are 1, 2, 3, 4, 5, and 6
  const validSize = [1, 2, 3, 4, 5, 6].includes(size) ? size : 1;
  // Base width is 18mm (for size 1)
  return `${validSize * 18}mm`;
});

const hasContent = computed(() => {
  return !!props.icon || !!props.description || !!props.location;
});

const tooltipText = computed(() => {
  return `Row: ${props.rowIndex}, Module: ${props.moduleIndex}`;
});
</script>

<template>
  <div 
    class="module text-center" 
    :class="{ 'module-empty': !hasContent }" 
    :style="{ width: moduleWidth }"
  >
    <v-tooltip
      location="top"
      :text="tooltipText"
      open-delay="500"
    >
      <template v-slot:activator="{ props: tooltipProps }">
        <div 
          class="module-content"
          v-bind="tooltipProps"
          @click="handleEdit"
        >
          <div class="module-icon">
            <img v-if="iconSrc" :src="iconSrc" :alt="description" class="icon-image" />
            <span v-else>{{icon}}</span>
          </div>
          <div class="module-description">{{description}}</div>
          <div class="module-location" v-if="location">{{location}}</div>
          <div class="module-location" v-else></div>
        </div>
      </template>
    </v-tooltip>
    
    <div class="module-edit d-print-none">
      <v-btn
        icon="mdi-pencil"
        size="x-small"
        color="primary"
        variant="text"
      ></v-btn>
    </div>
  </div>
</template>

<style scoped>
.module {
  width: 18mm;
  height: 100%;
  background-color: white;
  color: #333;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  position: relative;
  margin: 2px;
}

.module:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.module-icon {
  height: 8mm;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}

.module:hover .module-icon {
  background-color: #edf2f7;
}

.module-icon img {
  max-width: 90%;
  max-height: 90%;
  transition: transform 0.2s ease;
}

.module:hover .module-icon img {
  transform: scale(1.05);
}

.module-description {
  height: 12mm;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  padding: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-weight: 500;
  line-height: 1.2;
  transition: background-color 0.2s ease;
}

.module:hover .module-description {
  background-color: #f0f4f8;
}

.module-location {
  background-color: #009e4d;
  color: white;
  height: 5mm;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  transition: background-color 0.2s ease;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.module:hover .module-location {
  background-color: #00873f;
}

.module-edit {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: scale(0.8);
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 0 0 0 8px;
}

.module:hover .module-edit {
  opacity: 1;
  transform: scale(1);
}

/* Dark theme overrides */
.v-theme--dark .module {
  background-color: #1e1e1e;
  color: #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .module-icon {
  background-color: #2d2d2d;
}

.v-theme--dark .module-icon img {
  filter: invert(100%) sepia(0%) saturate(2983%) hue-rotate(298deg) brightness(92%) contrast(90%);
}

.v-theme--dark .module:hover .module-icon {
  background-color: #333333;
}

.v-theme--dark .module-description {
  background-color: #1e1e1e;
}

.v-theme--dark .module:hover .module-description {
  background-color: #252525;
}

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .module {
    background-color: white !important;
    color: black !important;
    box-shadow: none !important;
    border-left: 1px solid #ddd !important;
    border-right: 1px solid #ddd !important;
    border-top: 1px solid #555 !important;
    transform: none !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  .module-icon {
    background-color: white !important;
  }

  .module-description {
    background-color: white !important;
  }

  .module-location {
    background-color: #009e4d !important;
    color: white !important;
  }

  .module-edit {
    display: none !important;
  }
}
</style>
