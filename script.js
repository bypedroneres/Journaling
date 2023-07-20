let entryId = 0;

// Load existing entries from local storage
window.addEventListener('DOMContentLoaded', function() {
    loadEntriesFromLocalStorage();
});

document.getElementById('save-button').addEventListener('click', function() {
    var entryText = document.getElementById('journal-entry').value;
    if (entryText.trim() !== '') {
        var entryDate = new Date().toLocaleString();

        // Create entry object
        var entry = {
            text: entryText,
            date: entryDate
        };

        // Save entry to local storage
        var entries = localStorage.getItem('journalEntries');
        var existingEntries = entries ? JSON.parse(entries) : [];
        existingEntries.unshift(entry);
        localStorage.setItem('journalEntries', JSON.stringify(existingEntries));

        // Create entry element and prepend it to the entries container
        createEntryElement(entryText, entryDate);

        document.getElementById('journal-entry').value = '';
    }
});

function createEntryElement(text, date) {
    var entryElement = document.createElement('div');
    entryElement.className = 'entry';
    entryElement.title = date;
    

    var entryTextElement = document.createElement('p');
    entryTextElement.innerText = text;

    var editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.className = 'edit-button';
    editButton.addEventListener('click', function() {
        var newText = prompt('Edit your entry:', text);
        if (newText !== null && newText.trim() !== '') {
            entryTextElement.innerText = newText;

            // Update entry in local storage
            var entries = localStorage.getItem('journalEntries');
            var existingEntries = entries ? JSON.parse(entries) : [];
            var index = Array.from(entryElement.parentNode.children).indexOf(entryElement);
            existingEntries[index].text = newText;
            localStorage.setItem('journalEntries', JSON.stringify(existingEntries));

            // Save entries to local storage
            saveEntriesToLocalStorage();
        }
    });

    var deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this entry?')) {
            entryElement.remove();

            // Remove entry from local storage and update the list
            var entries = localStorage.getItem('journalEntries');
            var existingEntries = entries ? JSON.parse(entries) : [];
            var index = Array.from(entryElement.parentNode.children).indexOf(entryElement);
            existingEntries.splice(index, 1);
            localStorage.setItem('journalEntries', JSON.stringify(existingEntries));

            // Save entries to local storage
            saveEntriesToLocalStorage();
        }
    });

    entryElement.appendChild(entryTextElement);
    entryElement.appendChild(editButton);
    entryElement.appendChild(deleteButton);

    document.getElementById('entries-container').prepend(entryElement);
}

function saveEntriesToLocalStorage() {
    const entries = document.getElementsByClassName('entry');
    const entriesArray = Array.from(entries).map(entry => ({
        text: entry.querySelector('p').innerText,
        date: entry.title
    }));
    localStorage.setItem('journalEntries', JSON.stringify(entriesArray));
}

function loadEntriesFromLocalStorage() {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
        const entriesArray = JSON.parse(savedEntries);
        entriesArray.forEach(entry => {
            createEntryElement(entry.text, entry.date);
        });
    }
}

// Call saveEntriesToLocalStorage when needed (after adding/deleting entries)
document.getElementById('entries-container').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button') || event.target.classList.contains('edit-button')) {
        saveEntriesToLocalStorage();
    }
});

