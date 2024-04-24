export const addToCart = (item) => {
  cartItems.value.push(item)
  item.isAdded = true
}

export const removeFromCart = (item) => {
  cartItems.value.splice(cartItems.value.indexOf(item), 1)
  item.isAdded = false
}
