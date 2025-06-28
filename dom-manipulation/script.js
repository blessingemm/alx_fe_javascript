let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Believe you can and you're halfway there.", category: "Inspiration" }
];

const displayQuotes = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const selectCategory = document.getElementById('categoryFilter');
const filterBtn = document.getElementById('filterQuote');
const containerForm = document.getElementById('formContainer');
const exportBtn = document.getElementById('exportQuotes');

let selectedCategory = 'all';

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    saveQuotes();
  }

  populateCategories();

  const lastCategory = localStorage.getItem('selectedCategory');
  if (lastCategory) {
    selectedCategory = lastCategory;
    selectCategory.value = selectedCategory;
    filterQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  selectCategory.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    selectCategory.appendChild(option);
  });
}

function filterQuotes() {
  selectedCategory = selectCategory.value;
  localStorage.setItem('selectedCategory', selectedCategory);

  let filteredQuotes = quotes;
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    displayQuotes.innerHTML = `No quotes found for category: ${selectedCategory}`;
  } else {
    const list = filteredQuotes.map(q => `"<em>${q.text}</em>" - (${q.category})`).join('<br>');
    displayQuotes.innerHTML = list;
  }
}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  displayQuotes.innerHTML = `"<em>${quote.text}</em>" - (${quote.category})`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function createAddQuoteForm() {
  const textInput = document.createElement('input');
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";
  textInput.type = "text";

  const categoryInput = document.createElement('input');
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.type = "text";

  const addQuoteBtn = document.createElement('button');
  addQuoteBtn.textContent = "Add Quote";
  addQuoteBtn.onclick = addQuote;

  containerForm.appendChild(textInput);
  containerForm.appendChild(categoryInput);
  containerForm.appendChild(addQuoteBtn);
}

function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    postQuoteToServer(newQuote);
    textInput.value = '';
    categoryInput.value = '';
    alert('Quote added. You can click Show New Quote to see it');
  } else {
    alert('Please, enter a quote and a category');
  }
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverData = await response.json();
    if (Array.isArray(serverData)) {
      // Just simulate conflict resolution: server data takes precedence
      console.log('Fetched quotes from server');
      quotes = serverData.map(post => ({
        text: post.title,
        category: "Server"  // since posts don't have category, assign one
      }));
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes updated from server (server data took precedence)');
    }
  } catch (err) {
    console.error('Error fetching quotes from server:', err);
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(quote),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });
    console.log('Posted quote to server:', quote);
  } catch (err) {
    console.error('Error posting to server:', err);
  }
}

function exportToJsonFile() {
  const json = JSON.stringify(quotes, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully');
      } else {
        alert('Invalid file format');
      }
    } catch (e) {
      alert('Error reading file');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Periodically fetch from server every 30 seconds
setInterval(fetchQuotesFromServer, 30000);

loadQuotes();
createAddQuoteForm();
newQuoteBtn.addEventListener('click', showRandomQuote);
filterBtn.addEventListener('click', filterQuotes);
exportBtn.addEventListener('click', exportToJsonFile);
