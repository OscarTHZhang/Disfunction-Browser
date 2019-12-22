const {ipcRenderer} = require('electron')
const items = require('./items.js')
// DOM nodes
let showModal = document.getElementById("show-modal")
let closeModal = document.getElementById('close-modal')
let modal = document.getElementById('modal')
let addItem = document.getElementById('add-item')
let itemUrl = document.getElementById('url')
let search = document.getElementById('search')

// filter item with search
search.addEventListener("keyup", event => {

  // loop items
  Array.from(document.getElementsByClassName('read-item')).forEach(item => {
    // hide any items that do not match the search value
    let isMatched = item.innerText.toLowerCase().includes(search.value)
    item.style.display = isMatched ? "flex" : "none"
  })

})

//disable and enable model button
const toggleModalButtons = () => {
  if (addItem.disable === true) {
    addItem.disable = false
    addItem.style.opacity = 1
    addItem.innerText = "Add Item"
    closeModal.style.display = 'inline'
  } else {
    addItem.disable = true
    addItem.style.opacity = 0.5
    addItem.innerText = 'Adding ...'
    closeModal.style.display = 'none'
  }
}

// show modal
showModal.addEventListener('click', event => {
  modal.style.display = "flex"
  itemUrl.focus()
})

// close modal
closeModal.addEventListener('click', event => {
  modal.style.display = "none"
})

addItem.addEventListener('click', event => {
  if (itemUrl.value) {
    ipcRenderer.send('new-item', itemUrl.value)
    toggleModalButtons()
  }
})

// listen for key event
itemUrl.addEventListener('keyup', event => {
  if (event.key === "Enter") {
    addItem.click()
  }
})

// listen for new message from main process
ipcRenderer.on('new-item-success', (event, newItem) => {
  // display for error checking
  console.log(newItem)

  // add new item
  items.addItem(newItem, true)

  // toggle back the button
  toggleModalButtons()

  // hide modal
  modal.style.display = 'none'
  itemUrl.value = ''
})
