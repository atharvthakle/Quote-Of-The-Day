const API_URL = "https://api.quotable.io";

async function getRandomQuote() {
  try {
    const response = await fetch(`${API_URL}/random`);
    const data = await response.json();
    return { quote: data.content, author: data.author };
  } catch (error) {
    console.error("Error fetching random quote:", error);
  }
}

async function getQuotesByAuthor(author) {
  try {
    const response = await fetch(`${API_URL}/quotes?author=${author}`);
    const data = await response.json();
    return data.results.map((quote) => ({
      quote: quote.content,
      author: quote.author,
    }));
  } catch (error) {
    console.error("Error fetching quotes by author:", error);
  }
}

function adjustFontSize(element, container, maxFontSize) {
  const maxHeight = container.clientHeight;
  const maxWidth = container.clientWidth;

  let fontSize = maxFontSize; // Starting font size

  // Set initial font size
  element.style.fontSize = `${fontSize}px`;

  // Decrease font size until it fits within container
  while (element.scrollHeight > maxHeight || element.scrollWidth > maxWidth) {
    fontSize--;
    element.style.fontSize = `${fontSize}px`;

    // Prevent font size from becoming too small
    if (fontSize <= 12) {
      break;
    }
  }
}

function displayQuote(quoteObj) {
  const quoteElement = document.getElementById("quote");
  const authorElement = document.getElementById("author");
  const quoteBox = document.getElementById("quote-box");

  quoteElement.textContent = `"${quoteObj.quote}"`;
  authorElement.textContent = `- ${quoteObj.author}`;

  adjustFontSize(quoteElement, quoteBox, 24); // Adjust quote font size with max size 24px
  adjustFontSize(authorElement, quoteBox, 18); // Adjust author font size with max size 18px

  // Ensure author's font size is smaller than quote's font size
  authorElement.style.fontSize = "16px";
}

function displayQuotesList(quotesList) {
  const resultsBox = document.getElementById("results-box");
  const results = document.getElementById("results");
  results.innerHTML = ""; // Clear previous results

  quotesList.forEach((q) => {
    const quoteElement = document.createElement("p");
    quoteElement.textContent = `"${q.quote}"`;
    results.appendChild(quoteElement);

    const authorElement = document.createElement("p");
    authorElement.textContent = `- ${q.author}`;
    authorElement.classList.add("author");
    results.appendChild(authorElement);

    adjustFontSize(quoteElement, resultsBox, 18); // Adjust quote font size with max size 18px for results
    adjustFontSize(authorElement, resultsBox, 14); // Adjust author font size with max size 14px for results

    // Ensure author's font size is smaller than quote's font size
    authorElement.style.fontSize = "14px";
  });

  resultsBox.style.display = "block";
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Quote copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

function speakQuote(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

document.getElementById("new-quote").addEventListener("click", async () => {
  const randomQuote = await getRandomQuote();
  displayQuote(randomQuote);
  document.getElementById("results-box").style.display = "none"; // Hide results if new quote is displayed
});

document.getElementById("copy-quote").addEventListener("click", () => {
  const quoteText = document.getElementById("quote").textContent;
  copyToClipboard(quoteText);
});

document.getElementById("speak-quote").addEventListener("click", () => {
  const quoteText = document.getElementById("quote").textContent;
  speakQuote(quoteText);
});

document.getElementById("search-button").addEventListener("click", async () => {
  const searchTerm = document.getElementById("search-box").value;
  if (!searchTerm) {
    alert("Please enter an author's name.");
    return;
  }

  const filteredQuotes = await getQuotesByAuthor(searchTerm);
  if (filteredQuotes.length > 0) {
    displayQuotesList(filteredQuotes);
  } else {
    alert("No quotes found for the searched author.");
  }
});

// Display a random quote on page load
window.onload = async () => {
  const randomQuote = await getRandomQuote();
  displayQuote(randomQuote);
};
