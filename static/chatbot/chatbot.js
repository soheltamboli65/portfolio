document.addEventListener("DOMContentLoaded", function () {
    console.log("Chatbot JS loaded");

    const icon = document.getElementById("chatbot-icon");
    const chat = document.getElementById("chatbot");
    const closeBtn = document.getElementById("close-chat");
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const messagesDiv = document.getElementById("chat-messages");

    // Safety check
    if (!icon || !chat || !closeBtn || !input || !sendBtn || !messagesDiv) {
        console.error("Chatbot elements missing in DOM");
        return;
    }

    let isOpen = false;
    let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

    function renderMessages() {
        messagesDiv.innerHTML = "";
        history.forEach(msg => {
            const div = document.createElement("div");
            div.className = msg.role;
            div.textContent = msg.text;
            messagesDiv.appendChild(div);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function openChat() {
        chat.classList.remove("hidden");
        isOpen = true;
        renderMessages();
    }

    function closeChat() {
        chat.classList.add("hidden");
        isOpen = false;
    }

    /* ---------------- TOGGLE LOGIC ---------------- */

    // 💬 ICON → TOGGLE
    icon.onclick = function () {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    };

    // ❌ CLOSE BUTTON → FORCE CLOSE
    closeBtn.onclick = function (e) {
        e.stopPropagation(); // prevent bubbling
        closeChat();
    };

    /* ---------------- SEND MESSAGE ---------------- */

    sendBtn.onclick = sendMessage;

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        history.push({ role: "user", text });
        localStorage.setItem("chatHistory", JSON.stringify(history));
        renderMessages();
        input.value = "";

        fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        })
        .then(res => res.json())
        .then(data => {
            history.push({ role: "bot", text: data.reply });
            localStorage.setItem("chatHistory", JSON.stringify(history));
            renderMessages();
        })
        .catch(() => {
            history.push({ role: "bot", text: "Server error. Please try again." });
            renderMessages();
        });
    }
});
