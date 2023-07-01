// Load existing entries from local storage
window.addEventListener('DOMContentLoaded', function() {
    var entries = localStorage.getItem('journalEntries');
    if (entries) {
        var parsedEntries = JSON.parse(entries);
        parsedEntries.forEach(function(entry) {
            createEntryElement(entry.text, entry.date);
        });
    }
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
        }
    });

    var deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete this entry?')) {
        entryElement.remove();

        // Remove entry from local storage
        var entries = localStorage.getItem('journalEntries');
        var existingEntries = entries ? JSON.parse(entries) : [];
        var index = Array.from(entryElement.parentNode.children).indexOf(entryElement);
        existingEntries.splice(index, 1);
        localStorage.setItem('journalEntries', JSON.stringify(existingEntries));
    }
});

    entryElement.appendChild(entryTextElement);
    entryElement.appendChild(editButton);
    entryElement.appendChild(deleteButton);

    document.getElementById('entries-container').prepend(entryElement);
}
