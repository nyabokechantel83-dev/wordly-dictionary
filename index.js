const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const errorMessage = document.getElementById("error-message");

const word = document.getElementById("word");
const pronunciation = document.getElementById("pronunciation");
const partOfSpeech = document.getElementById("part-of-speech");
const definition = document.getElementById("definition");
const example = document.getElementById("example");
const synonyms = document.getElementById("synonyms");
const audio = document.getElementById("audio");
const source = document.getElementById("source");

form.addEventListener("submit", searchWord);

async function searchWord(event) {
    event.preventDefault();

    const searchTerm = input.value.trim();

    if (searchTerm === "") {
        showError("Please enter a word.");
        return;
    }

    clearResults();
    hideError();
    loading.classList.remove("hidden");

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`);

        if (!response.ok) {
            throw new Error("Word not found. Please try another word.");
        }

        const data = await response.json();
        displayWord(data[0]);

    } catch (error) {
        showError(error.message);

    } finally {
        loading.classList.add("hidden");
    }
}

function displayWord(data) {
    results.classList.remove("hidden");

    word.textContent = data.word;

    const phonetic = data.phonetics.find(item => item.text);

    if (phonetic) {
        pronunciation.textContent = phonetic.text;
    } else {
        pronunciation.textContent = "Not available";
    }

    if (data.meanings.length > 0) {
        partOfSpeech.textContent = data.meanings[0].partOfSpeech;
        definition.textContent = data.meanings[0].definitions[0].definition;

        if (data.meanings[0].definitions[0].example) {
            example.textContent = data.meanings[0].definitions[0].example;
        } else {
            example.textContent = "No example available.";
        }

        const synonymList = data.meanings[0].definitions[0].synonyms || data.meanings[0].synonyms || [];

        if (synonymList.length > 0) {
            synonyms.textContent = synonymList.join(", ");
        } else {
            synonyms.textContent = "No synonyms available.";
        }

    } else {
        partOfSpeech.textContent = "Not available";
        definition.textContent = "Not available";
        example.textContent = "No example available.";
        synonyms.textContent = "No synonyms available.";
    }

    const audioData = data.phonetics.find(item => item.audio);

    if (audioData) {
        audio.src = audioData.audio;
        audio.style.display = "block";
    } else {
        audio.style.display = "none";
    }

    if (data.sourceUrls && data.sourceUrls.length > 0) {
        source.href = data.sourceUrls[0];
        source.textContent = "View Source";
    } else {
        source.textContent = "No source available.";
        source.removeAttribute("href");
    }
}

function showError(message) {
    errorMessage.textContent = message;
}

function hideError() {
    errorMessage.textContent = "";
}

function clearResults() {
    results.classList.add("hidden");

    word.textContent = "";
    pronunciation.textContent = "";
    partOfSpeech.textContent = "";
    definition.textContent = "";
    example.textContent = "";
    synonyms.textContent = "";

    audio.src = "";
    audio.style.display = "none";

    source.textContent = "";
    source.removeAttribute("href");
}