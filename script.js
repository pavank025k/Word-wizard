// Get references to DOM elements
const wordInput = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const resultBox = document.getElementById("result");

// Base URL of Free Dictionary API
const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// Event listener for the Search button
searchBtn.addEventListener("click", () => {
  const word = wordInput.value.trim();
  
  // Clear old results
  resultBox.innerHTML = "";

  if (word === "") {
    resultBox.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  // Fetch definition from the API
  fetch(`${API_BASE}${word}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Word not found");
      }
      return response.json();
    })
    .then(data => {
      displayDefinition(data[0]);
    })
    .catch(error => {
      resultBox.innerHTML = `<p>❌ ${error.message}</p>`;
    });
});

/**
 * Display definition and details from API response
 * @param {Object} data - Response object from Dictionary API
 */
function displayDefinition(data) {
  const { word, phonetic, meanings } = data;

  // Show word and phonetics
  let html = `
    <h2>${word} <span style="font-size: 0.8em; color: gray;">${phonetic || ""}</span></h2>
    <hr/>
  `;

  // Iterate through meanings and definitions
  meanings.forEach(meaning => {
    const partOfSpeech = meaning.partOfSpeech;
    const definitions = meaning.definitions;

    definitions.forEach((def, index) => {
      html += `
        <div class="meaning">
          <strong>${partOfSpeech}</strong> - ${def.definition}
          ${def.example ? `<br><em>Example:</em> "${def.example}"` : ""}
        </div>
      `;
    });
  });

  resultBox.innerHTML = html;
}