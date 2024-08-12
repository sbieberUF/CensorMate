document.getElementById("block-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const words = document.getElementById("words").value.split(',').map(word => word.trim());
    const replacements = document.getElementById("replacements").value.split(',').map(replacement => replacement.trim());
    
    const replacementMap = {};
    words.forEach((word, index) => {
        replacementMap[word] = replacements[index] || "[censored]";
    });

    chrome.storage.sync.get("blockedWordsMap", function (data) {
        const existingMap = data.blockedWordsMap || {};
        const updatedMap = { ...existingMap, ...replacementMap };

        chrome.storage.sync.set({
            blockedWordsMap: updatedMap
        }, function () {
            document.getElementById("status").textContent = "Settings saved!";
            displayBlockedWords(); // Update list
            setTimeout(function () {
                document.getElementById("status").textContent = "";
            }, 2000);
        });
    });
});

document.getElementById("clear-words").addEventListener("click", function () {
    chrome.storage.sync.set({ blockedWordsMap: {} }, function () {
        document.getElementById("status").textContent = "Blocked words cleared!";
        displayBlockedWords(); // Update list
        setTimeout(function () {
            document.getElementById("status").textContent = "";
        }, 2000);
    });
});

function displayBlockedWords() {
    chrome.storage.sync.get("blockedWordsMap", function (data) {
        const blockedWordsMap = data.blockedWordsMap || {};
        const blockedWordsList = document.getElementById("blocked-words-list");

        // Clear list
        blockedWordsList.innerHTML = '';

        if (Object.keys(blockedWordsMap).length === 0) {
            // No words are being blocked, message displayed
            const message = document.createElement("li");
            message.textContent = "There are no words currently blocked!";
            blockedWordsList.appendChild(message);
        } else {
            // Populate the list with blocked words and their replacements
            for (const [word, replacement] of Object.entries(blockedWordsMap)) {
                const listItem = document.createElement("li");
                listItem.textContent = `${word} → ${replacement}`;
                blockedWordsList.appendChild(listItem);
            }
        }
    });

    document.getElementById('reset-password').addEventListener('click', function() {
        const newPassword = document.getElementById('new-password').value;
    
        // Set the new password
        chrome.storage.sync.set({ 'password': newPassword }, function() {
            document.getElementById('reset-status').textContent = 'Password has been reset!';
            setTimeout(function() {
                document.getElementById('reset-status').textContent = '';
            }, 2000);
        });
    });
}

// Call displayBlockedWords when the popup is loaded
document.addEventListener("DOMContentLoaded", displayBlockedWords);
