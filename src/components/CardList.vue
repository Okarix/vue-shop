<script setup>
import Card from './Card.vue'

defineProps({
  items: Array
})

const emit = defineEmits(['addToFavorite', 'addToCart'])
</script>

<template>
  <div class="grid grid-cols-4 gap-5 mt-5">
    <Card
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :image-url="item.imageUrl"
      :price="item.price"
      :is-favorite="item.isFavorite"
      :id="item.id"
      :on-click-favorite="() => emit('addToFavorite', item)"
      :on-click-add="() => emit('addToCart', item)"
      :is-added="item.isAdded"
    />
  </div>
</template>
