let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Believe you can and you're halfway there.", category: "Inspiration" }
];

const displayQuotes = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const selectCategory = document.getElementById('categoryFilter')
const filterBtn = document.getElementById('filterQuote')
const containerForm = document.getElementById('formContainer')

function showRandomQuote(){
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex]
  displayQuotes.innerText = `"${quote.text}" - (${quote.category})`;

}


function showRandomQuoteByCategory(){
  const category = selectCategory.value.trim()
  if(!category){
    alert('Please, enter a category')
    return;
  }
  const filtered = quotes.filter(quote => quote.category.toLowerCase() === category.toLowerCase())
  if(filtered.length === 0){
    displayQuotes.innerText = `No quotes found for category: ${category}`;
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex]
  displayQuotes.innerText = `"${quote.text}" - (${quote.category})`;
}


function createAddQuoteForm(){
  const textInput = document.createElement('input');
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote"
  textInput.type = "text"

  const categoryInput = document.createElement('input');
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addQuoteBtn = document.createElement('button');
  addQuoteBtn.textContent = "Add Quote";
  addQuoteBtn.onclick = addQuote;

  containerForm.appendChild(textInput);
  containerForm.appendChild(categoryInput);
  containerForm.appendChild(addQuoteBtn)
}
function addQuote(){
  const textInput = document.getElementById('newQuoteText')
  const categoryInput = document.getElementById('newQuoteCategory')
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  if(text && category){
    quotes.push({ text: text, category: category })
    textInput.value = '';
    categoryInput.value = '';
    alert('Jokes added. You can click show New Quote to see it')
  }else{
    alert('Please, enter a quote and a category')
  }
}
newQuoteBtn.addEventListener('click', showRandomQuote)
filterBtn.addEventListener('click', showRandomQuoteByCategory)
createAddQuoteForm()