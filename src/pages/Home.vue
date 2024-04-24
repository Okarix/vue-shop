<script setup>
import debounce from 'lodash.debounce'
import { inject, reactive, ref, watch, onMounted } from 'vue'
import CardList from '@/components/CardList.vue'
import { fetchFavorites, fetchItems, addToFavorite } from '@/api/fetch'
const { cartItems } = inject('cart')
import { addToCart, removeFromCart } from '@/utils/cartActions'

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

const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value
}, 300)

onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cartItems.value = localCart ? JSON.parse(localCart) : []

  const itemsData = await fetchItems(filters, items)
  items.value = itemsData

  const favoritesData = await fetchFavorites(items)
  items.value = favoritesData

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
