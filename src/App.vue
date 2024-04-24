<script setup>
import { ref, watch, provide, computed } from 'vue'
import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'

const cartItems = ref([])
const drawerState = ref(false)

const totalPrice = computed(() => cartItems.value.reduce((acc, item) => acc + item.price, 0))

const openDrawer = () => {
  drawerState.value = true
}

const closeDrawer = () => {
  drawerState.value = false
}

watch(
  cartItems,
  () => {
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  },
  { deep: true }
)

provide('cart', {
  cartItems,
  openDrawer,
  closeDrawer
})
</script>

<template>
  <Drawer v-if="drawerState" :total-price="totalPrice" />

  <div class="w-4/5 m-auto bg-white rounded-xl shadow-xl mt-14">
    <Header @open-drawer="openDrawer" :total-price="totalPrice" />

    <main class="p-10">
      <router-view></router-view>
    </main>
  </div>
</template>
