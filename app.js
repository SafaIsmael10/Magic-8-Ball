const history = [];

let voiceEnabled = false;
const voiceToggleBtn = document.getElementById("voice-toggle");

voiceToggleBtn.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  voiceToggleBtn.textContent = `🔊 Voice: ${voiceEnabled ? "On" : "Off"}`;
});

function speakAnswer(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  }
}

let canAsk = true; // controls cooldown
function shakeBall() 
{
  if (!canAsk) return; // stop if cooldown is active
  canAsk = false;      // lock immediately

  const question = document.getElementById("question").value.trim();
  const response = document.getElementById("response");

  if (question === "")
  {
    response.textContent = "Ask a question";
    return;
  }

  // Add shake class to the eight-ball to trigger the shake animation
  const ball = document.querySelector(".eight-ball");
  ball.classList.add("shake");
  
  // Remove the shake class after animation completes (0.5s)
  setTimeout(() => {
    ball.classList.remove("shake");
  }, 500); // Match this with the duration of the animation

  const responses = 
  [
    "Yes",
    "No",
    "Maybe",
    "Ask again later",
    "Definitely!",
    "Not in a million years",
    "I'm not sure",
    "Absolutely",
    "Better not tell you now"
  ];
  
  // Pick a random response
  const randomIndex = Math.floor(Math.random() * responses.length);
  const answer = responses[randomIndex];
  
  // Show the answer
  document.getElementById("response").textContent = answer;

  // Add question & answer to history
  history.unshift({ question, answer }); // newest first
  if (history.length > 10) history.pop(); // keep only last 10

  // Render history in the panel
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = ""; // clear current list
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `"${item.question}" → ${item.answer}`;
    historyList.appendChild(li);
  });

  document.getElementById("response").textContent = answer;

  // Speak the answer
  if (voiceEnabled) {
    speakAnswer(answer);
  }

  // ✅ release lock after 2 seconds
  setTimeout(() => {
    canAsk = true;
  }, 2000);
}

// Listen for Enter key press (key code 13)
document.getElementById("question").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    shakeBall();  // Trigger the shakeBall function when Enter is pressed
  }
});

const switchBtn = document.getElementById("theme-switch");

switchBtn.addEventListener("click", () => {
  document.body.classList.toggle("day-theme");
});

const toggleBtn = document.getElementById("history-toggle");
const historyPanel = document.getElementById("history-panel");

toggleBtn.addEventListener("click", () => {
  historyPanel.style.display = historyPanel.style.display === "block" ? "none" : "block";
});