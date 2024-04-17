<script setup>
import { onMounted, ref, watch, reactive, provide, computed } from 'vue'
import axios from 'axios'

import Header from './components/Header.vue'
import CardList from './components/CardList.vue'
import Drawer from './components/Drawer.vue'

const items = ref([])
const cartItems = ref([])
const drawerState = ref(false)
const isCreatingOrder = ref(false)

const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

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

const onClickPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const openDrawer = () => {
  drawerState.value = true
}

const closeDrawer = () => {
  drawerState.value = false
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value
}

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    }

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }

    const { data } = await axios.get('https://157b2cf8830f04b6.mokky.dev/items', {
      params
    })

    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      isAdded: false,
      favoriteId: null
    }))
  } catch (err) {
    console.error(err)
  }
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get('https://157b2cf8830f04b6.mokky.dev/favorites')

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.parentId === item.id)

      if (!favorite) {
        return item
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id
      }

      item.isFavorite = true

      const { data } = await axios.post('https://157b2cf8830f04b6.mokky.dev/favorites', obj)

      item.favoriteId = data.id
    } else {
      item.isFavorite = false
      await axios.delete(`https://157b2cf8830f04b6.mokky.dev/favorites/${item.favoriteId}`)
      item.favoriteId = null
    }

    console.log(data)
  } catch (err) {}
}

onMounted(async () => {
  // cartItems.value = JSON.parse(localStorage.getItem('cart') || '[]')
  const localCart = localStorage.getItem('cart')
  cartItems.value = localCart ? JSON.parse(localCart) : []

  await fetchItems()
  await fetchFavorites()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cartItems.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(filters, fetchItems)

watch(cartItems, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }))
})

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
  removeFromCart
})
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
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

        <div class="flex gap-4">
          <select
            @change="onChangeSelect"
            class="py-2 px-3 border rounded-md outline-none focus:border-gray-400"
          >
            <option value="name">По названию</option>
            <option value="-price">По цене (дорогие)</option>
            <option value="price">По цене (дешевые)</option>
          </select>

          <div class="relative">
            <img class="absolute left-4 top-3" src="/search.svg" alt="Search" />
            <input
              @input="onChangeSearchInput"
              placeholder="Поиск..."
              class="outline-none border rounded-md py-2 pl-11 pr-4 focus:border-gray-400"
              type="text"
            />
          </div>
        </div>
      </div>

      <CardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickPlus" />
    </main>
  </div>
</template>
