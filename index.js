// ==========================
// SELECT HTML ELEMENTS
// ==========================

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

// ==========================
// EVENT LISTENER
// ==========================

form.addEventListener("submit", searchWord);

// ==========================
// SEARCH FUNCTION
// ==========================

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

        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
        );

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

// ==========================
// DISPLAY DATA
// ==========================

function displayWord(data) {

    results.classList.remove("hidden");

    word.textContent = data.word;

    pronunciation.textContent =
        data.phonetics.find(item => item.text)?.text ||
        "Not available";

    partOfSpeech.textContent =
        data.meanings[0]?.partOfSpeech ||
        "Not available";

    definition.textContent =
        data.meanings[0]?.definitions[0]?.definition ||
        "Not available";

    example.textContent =
        data.meanings[0]?.definitions[0]?.example ||
        "No example available.";

    // Display synonyms

    const synonymList =
        data.meanings[0]?.definitions[0]?.synonyms ||
        data.meanings[0]?.synonyms ||
        [];

    if (synonymList.length > 0) {

        synonyms.textContent = synonymList.join(", ");

    } else {

        synonyms.textContent = "No synonyms available.";

    }

    // Audio pronunciation

    const audioData =
        data.phonetics.find(item => item.audio);

    if (audioData) {

        audio.src = audioData.audio;
        audio.style.display = "block";

    } else {

        audio.style.display = "none";

    }

    // Source Link

    if (data.sourceUrls && data.sourceUrls.length > 0) {

        source.href = data.sourceUrls[0];
        source.textContent = "View Source";

    } else {

        source.textContent = "No source available.";

    }

}

// ==========================
// SHOW ERROR
// ==========================

function showError(message) {

    errorMessage.textContent = message;

}

// ==========================
// HIDE ERROR
// ==========================

function hideError() {

    errorMessage.textContent = "";

}

// ==========================
// CLEAR RESULTS
// ==========================

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
    source.href = "";

}