import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://champions-edb23-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const wordleSolutionInDB = ref(database, "wordleSolution")

const inputFieldEl = document.getElementById("input-field")
const guessNumberEl = document.getElementById("guess-number")
const addButtonEl = document.getElementById("add-button")
const wordleSolutionEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    let guessNumber = guessNumberEl.value
    let wordleSolution = {
        word: inputValue,
        guesses: guessNumber
    }
    
    push(wordleSolutionInDB, wordleSolution)
    
    clearInputFieldEl()
})

onValue(wordleSolutionInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearwordleSolutionEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1] //Object - word: ... guesses:...
            let wordArray = Object.entries(currentItem)

            
            appendItemTowordleSolutionEl(wordArray)
        }    
    } else {
        wordleSolutionEl.innerHTML = "No items here... yet"
    }
})

function clearwordleSolutionEl() {
    wordleSolutionEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemTowordleSolutionEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `wordleSolution/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    wordleSolutionEl.append(newEl)
}