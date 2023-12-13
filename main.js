const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
//console.log(chatInput)
// console.log(themeButton)
let userText = null;
const API_KEY = "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";
const initialHeight = chatInput.scrollHeight;

// sayfa yüklendiğinde yerel depodan(localStorage) veri yükler
const loadDataFormLocalStorage = () => {
  //tema rengini kontrol eder ve geçerli tema rengini uygular.
  const themeColor = localStorage.getItem("theme-color");
  //tema rengini yerel depoda günceller.
  localStorage.setItem("theme-color", themeButton.innerText);
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
  const defaultText = `
   <div class="default-text">
    <h1>ChatGPT Clone</h1>
   </div>`;
  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  //sayfayı sohbetin en altına kaydırır
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

loadDataFormLocalStorage();

const createElement = (html, className) => {
  //yeni div oluşturma ve belirtilen chat sınıfına ekleme
  //div'in html içeriğini ayarlama
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");
  //api talebi için özelliklerini ve verileri tanımlama
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };
  //
  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    pElement.textContent = response.choices[0].text.trim();
  } catch (error) {
    console.log(error);
    pElement.textContent = "opppss";
    pElement.style.color = "red";
  }
  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const showTypingAnimation = () => {
  const html = `<div class="chat-content">
    <div class="chat-details">
        <img src="images/chatgpt-icon.png" alt="chat-images">
        <div class="typing-animation">
            <div class="typing-dot" style="--delay: 0.2s"></div>
            <div class="typing-dot" style="--delay: 0.3s"></div>
            <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
    </div>
    <span class="material-symbols-outlined">
        content_copy
        </span>
</div>
`;
  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

const handleOutGoingChat = () => {
  userText = chatInput.value.trim(); //chatInput değerini alır ve fazladan boşlukları siler
  if (!userText) return; //chatInputun içi boş ise çalışmasın
  const html = `<div class="chat-content">
    <div class="chat-details">
        <img src="images/user.jpg" alt="user-image">
        <p>
        ${userText}
        </p>
    </div>
</div>`;
  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  document.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);
};

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme-color", themeButton.innerText);
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteButton.addEventListener("click", () => {
  if (confirm("Silmek istediğinizden emin misiniz?")) {
    localStorage.removeItem("all-chats");
    loadDataFormLocalStorage();
  }
});

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleOutGoingChat();
  }
});

sendButton.addEventListener("click", handleOutGoingChat);
