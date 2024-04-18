<script setup>
import axios from 'axios'
import { inject, reactive, ref, watch, onMounted } from 'vue'
import CardList from '@/components/CardList.vue'

const { cartItems, addToCart, removeFromCart } = inject('cart')

const items = ref([])
const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const onClickPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value
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

onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cartItems.value = localCart ? JSON.parse(localCart) : []

  await fetchItems()
  await fetchFavorites()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cartItems.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(cartItems, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }))
})

watch(filters, fetchItems)
</script>

<template>
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
</template>
