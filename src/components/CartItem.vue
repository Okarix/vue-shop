<script setup>
defineProps({
  id: Number,
  imageUrl: String,
  title: String,
  price: Number
})

const emit = defineEmits(['onClickRemove'])
</script>

<template>
  <div class="flex border items-center border-slate-200 p-4 rounded-xl gap-4">
    <img class="w-16 h-16" :src="imageUrl" alt="Sneaker" />

    <div class="flex justify-between flex-col flex-1">
      <p>{{ title }}</p>

      <div class="flex justify-between mt-2">
        <b class="mt-2">{{ price }} тг.</b>
        <img
          class="opacity-40 hover:opacity-100 cursor-pointer transition"
          src="/close.svg"
          alt="Close"
          @click="emit('onClickRemove')"
        />
      </div>
    </div>
  </div>
</template>
