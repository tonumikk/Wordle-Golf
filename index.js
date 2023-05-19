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
const eagleListEl = document.getElementById("eagle-list")
const birdieListEl = document.getElementById("birdie-list")
const parListEl = document.getElementById("par-list")
const bogeyListEl = document.getElementById("bogey-list")
const dblbogeyListEl = document.getElementById("dblbogey-list")
const golfScoreEl = document.getElementById("golf-score")

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
            let currentItemValue = currentItem[1] 
            let wordArray = Object.values(currentItem[1]) 
            let golfScoreValues = Object.values(currentItem[0])
            for(let j = 0;j < golfScoreValues.length; j++){
                let golfScore = ""
                golfScore += golfScoreValues[j]
            }
            golfScore(golfScore)
            appendItemTowordleSolutionEl(wordArray,currentItemID)
        }    
    } else {
        wordleSolutionEl.innerHTML = "No items here... yet"
    }
})

function clearwordleSolutionEl() {
    eagleListEl.innerHTML = ""
    birdieListEl.innerHTML = ""
    parListEl.innerHTML = ""
    bogeyListEl.innerHTML = ""
    dblbogeyListEl.innerHTML = ""
    wordleSolutionEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
    guessNumberEl.value= ""
}

function appendItemTowordleSolutionEl(item,itemIDInDB) {
    let itemID = item[0]
    let itemValue = item[2]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `wordleSolution/${itemIDInDB}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    if(itemID === "2"){
        eagleListEl.append(newEl)
    }else if (itemID === "3"){
        birdieListEl.append(newEl)
    }else if (itemID === "4"){
        parListEl.append(newEl)
    }else if (itemID === "5"){
        bogeyListEl.append(newEl)
    }else if (itemID === "6"){
        dblbogeyListEl.append(newEl)
    }else{
    wordleSolutionEl.append(newEl)
    }
    
    golfScore()
}

function golfScore(score){
    golfScoreEl.innerHTML = `Golf score: ${score}` 
}