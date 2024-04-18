<script setup>
import axios from 'axios'
import { ref, computed, inject } from 'vue'
import DrawerHead from './DrawerHead.vue'
import CartItemList from './CartItemList.vue'
import InfoBlock from './InfoBlock.vue'

const emit = defineEmits(['createOrder'])

const props = defineProps({
  totalPrice: Number
})

const { cartItems, closeDrawer } = inject('cart')
const isCreating = ref(false)
const orderId = ref(false)

const cartIsEmpty = computed(() => cartItems.value.length === 0)

const btnDisabled = computed(() => isCreating.value || cartIsEmpty.value)

const createOrder = async () => {
  try {
    isCreating.value = true

    const { data } = await axios.post('https://157b2cf8830f04b6.mokky.dev/orders', {
      items: cartItems.value,
      totalPrice: props.totalPrice
    })

    cartItems.value = []

    orderId.value = data.id
  } catch (err) {
    console.error('error')
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-full bg-black z-10 opacity-70"></div>

  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8 overflow-y-scroll">
    <DrawerHead />

    <div v-if="!totalPrice || orderId" class="flex h-full items-center">
      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="Корзина пустая"
        description="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        img-url="./package-icon.png"
      />
      <InfoBlock
        v-if="orderId"
        title="Заказ оформлен!"
        :description="`Ваш заказ #${orderId} скоро будет передан курьерской доставке`"
        img-url="order-success-icon.png"
      />
    </div>

    <div v-else>
      <CartItemList />

      <div class="flex flex-col gap-4 mt-7">
        <div class="flex gap-2 mb-6">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ props.totalPrice }} тг.</b>
        </div>

        <button
          :disabled="btnDisabled"
          class="bg-lime-500 w-full rounded-xl py-3 text-white hover:bg-lime-600 transition active:bg-lime-700 disabled:bg-slate-400 cursor-pointer"
          @click="createOrder"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>
