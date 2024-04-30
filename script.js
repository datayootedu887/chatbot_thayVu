function scrollToLatestMessage() {
    const chatContainer = document.getElementById('messages');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function appendBreak() {
    let hr = document.createElement('hr');
    document.getElementById('messages').appendChild(hr);
}

function displayUserMessage(message) {
    let userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.innerText = message;
    document.getElementById('messages').appendChild(userMessageDiv);
    //appendBreak();  // Add the dashed line break after the user's message
    scrollToLatestMessage();  // Ensure the view is scrolled to this new message
}

function sendMessage() {
    let userInputField = document.getElementById('user-input');
    let message = userInputField.value;
    if (message.trim() === "") return;

    // Display user's message in chat container
    displayUserMessage(message);
    userInputField.value = "I am processing your requests. Please wait. It may take some minutes";
    userInputField.disabled = true;
    fetch('process_request.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'message=' + encodeURIComponent(message)
    }).then(response => response.text()).then(data => {
        let messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerText = data;
        document.getElementById('messages').appendChild(messageDiv);
        appendBreak(); // Add the dashed line break after the bot's response
        scrollToLatestMessage();  // Ensure the view is scrolled to this new response
        userInputField.value = '';
        userInputField.disabled = false;
    }).catch((error) => {
        console.error('Error:', error);
        userInputField.value = '';
        userInputField.disabled = false;
        alert('An error occurred. Please try again.');
    });
}

document.getElementById('user-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

// New code for saving chat content
document.getElementById('saveChat').addEventListener('click', function() {
    let chatContent = document.getElementById('messages').innerText;
    let blob = new Blob([chatContent], {
        type: "text/plain;charset=utf-8"
    });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'chat.txt';
    a.click();
});

document.getElementById('sendButton').addEventListener('click', function() {
    sendMessage();
});
