<script setup>
import Header from './components/Header.vue'
import CardList from './components/CardList.vue'
</script>

<template>
  <!-- <Drawer /> -->

  <div class="w-4/5 m-auto bg-white rounded-xl shadow-xl mt-14">
    <Header />

    <main class="p-10">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

        <div class="flex gap-4">
          <select class="py-2 px-3 border rounded-md outline-none focus:border-gray-400">
            <option value="">По названию</option>
            <option value="">По цене (дорогие)</option>
            <option value="">По цене (дешевые)</option>
          </select>

          <div class="relative">
            <img class="absolute left-4 top-3" src="/search.svg" alt="Search" />
            <input
              placeholder="Поиск..."
              class="outline-none border rounded-md py-2 pl-11 pr-4 focus:border-gray-400"
              type="text"
            />
          </div>
        </div>
      </div>

      <CardList />
    </main>
  </div>
</template>
