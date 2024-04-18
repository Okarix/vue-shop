<script setup>
import { ref, watch, reactive, provide, computed } from 'vue'
import axios from 'axios'
import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'

/*Корзина */
const cartItems = ref([])
const drawerState = ref(false)
const isCreatingOrder = ref(false)

const totalPrice = computed(() => cartItems.value.reduce((acc, item) => acc + item.price, 0))
const cartIsEmpty = computed(() => cartItems.value.length === 0)

const cardButtonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value)

const createOrder = async () => {
  try {
    isCreatingOrder.value = true

    const { data } = await axios.post('https://157b2cf8830f04b6.mokky.dev/orders', {
      items: cartItems.value,
      totalPrice: totalPrice.value
    })

    cartItems.value = []

    return data
  } catch (err) {
    console.error('error')
  } finally {
    isCreatingOrder.value = false
  }
}

const addToCart = (item) => {
  cartItems.value.push(item)
  item.isAdded = true
}

const removeFromCart = (item) => {
  cartItems.value.splice(cartItems.value.indexOf(item), 1)
  item.isAdded = false
}

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
  closeDrawer,
  openDrawer,
  removeFromCart,
  addToCart
})
/*Корзина */
</script>

<template>
  <Drawer
    v-if="drawerState"
    :total-price="totalPrice"
    @create-order="createOrder"
    :is-creating-order="isCreatingOrder"
    :btn-disabled="cardButtonDisabled"
  />

  <div class="w-4/5 m-auto bg-white rounded-xl shadow-xl mt-14">
    <Header @open-drawer="openDrawer" :total-price="totalPrice" />

    <main class="p-10">
      <router-view></router-view>
    </main>
  </div>
</template>
