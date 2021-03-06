
const fs = require('fs')

let items = document.getElementById('items')
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString()
})

exports.storage = JSON.parse(localStorage.getItem("readit-items")) || []

exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

// set item as selected
exports.select = event => {
  document.getElementsByClassName('read-item selected')[0].classList.remove('selected')
  event.currentTarget.classList.add('selected')
}

// move by keys
exports.changeSelection = direction => {

  let curItem = document.getElementsByClassName('read-item selected')[0]

  if (direction === 'ArrowUp' && curItem.previousSibling) {
    curItem.classList.remove('selected')
    curItem.previousSibling.classList.add('selected')
  } else if (direction === 'ArrowDown' && curItem.nextSibling) {
    curItem.classList.remove('selected')
    curItem.nextSibling.classList.add('selected')
  }

}

// open selected items
exports.open = () => {
  // check if we have item to open
  if (!this.storage.length) return

  let selectedItem = document.getElementsByClassName('read-item selected')[0]
  let contentURL = selectedItem.dataset.url

  let viewWindow = window.open(contentURL, '', `
    maxWidth=2000,
    maxHeight=2000,
    width=1000,
    height=750,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
  `)

}

// Delete the select item
exports.deleteItem = () => {

  itemIndex = this.getSelectedItem().index

  // Remove item from DOM
  items.removeChild( items.childNodes[itemIndex] )

  // Remove from storage
  this.storage.splice(itemIndex, 1)

  // Persist
  this.save()

  // Select previous item or new first item if first was deleted
  if (this.storage.length) {

    // Get new selected item index
    let newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1

    // Set item at new index as selected
    document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
  }
}

// get the selectedItem's object and index in localStorage array
exports.getSelectedItem = () => {

  // Get selected node
  let currentItem = document.getElementsByClassName('read-item selected')[0]

  // Get item index
  let itemIndex = 0
  let child = currentItem
  while( (child = child.previousSibling) != null ) itemIndex++

  // Return selected item and index
  return { node: currentItem, index: itemIndex }
}

exports.addItem = (item, isNew = false ) => {

  let itemNode = document.createElement('div')

  itemNode.setAttribute('class', 'read-item')

  itemNode.setAttribute('data-url', item.url)

  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

  items.appendChild(itemNode)

  itemNode.addEventListener('click', this.select)
  itemNode.addEventListener('dblclick', this.open)

  // select first item
  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected')
  }

  if (isNew) {
    this.storage.push(item)
    this.save()
  }

}

// add items from storage when loads
this.storage.forEach(item => {
  this.addItem(item, false )
})
