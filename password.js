document.getElementById('submit-password').addEventListener('click', function() {
    const enteredPassword = document.getElementById('password').value;

    // Check if a password is already set
    chrome.storage.sync.get('password', function(data) {
        if (!data.password) {
            // No password is set, so save the entered password
            chrome.storage.sync.set({ 'password': enteredPassword }, function() {
                // Redirect to the main popup
                window.location.href = 'popup.html';
            });
        } else {
            // Validate the entered password
            if (enteredPassword === data.password) {
                // Correct password, redirect to the main popup
                window.location.href = 'popup.html';
            } else {
                // Incorrect password, show an error message
                document.getElementById('error-message').textContent = 'Incorrect password. Please try again.';
            }
        }
    });
});
