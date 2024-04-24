import axios from 'axios'

export const fetchItems = async (filters, items) => {
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

    return data.map((obj) => ({
      ...obj,
      isFavorite: false,
      isAdded: false,
      favoriteId: null
    }))
  } catch (err) {
    console.error(err)
  }
}

export const fetchFavorites = async (items) => {
  try {
    const { data: favorites } = await axios.get('https://157b2cf8830f04b6.mokky.dev/favorites')

    return items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.item_id === item.id)

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

export const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        item_id: item.id
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
  } catch (err) {
    console.error(err)
  }
}
