const powerBtn = document.getElementById('powerBtn');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatWindow = document.getElementById('chatWindow');
const statusText = document.getElementById('statusText');
const chatCard = document.getElementById('chatCard');
const chips = document.querySelectorAll('.chip');

const jokes = [
  'Why did the scarecrow win an award? Because he was outstanding in his field!',
  'I told my computer I needed a break, and now it won’t stop sending me beach wallpapers.',
  'What do you call fake spaghetti? An impasta!',
  'My friend said I should do lunges to stay in shape. That would be a big step forward.',
  'I only know 25 letters of the alphabet. I don’t know y.',
  'Did you hear about the restaurant on the moon? Great food, no atmosphere.',
  'I used to be addicted to the hokey pokey, but then I turned myself around.',
  'Why don’t eggs tell jokes? They’d crack each other up.',
  'I asked the librarian if the library had any books on paranoia. She whispered, “They’re right behind you.”',
  'I’m reading a book about anti-gravity. It’s impossible to put down.'
];

let isOn = false;

function addMessage(text, type) {
  const message = document.createElement('div');
  message.className = `message ${type}`;
  const prefix = type === 'bot' ? '✨ ' : '';
  message.textContent = `${prefix}${text}`;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getRandomJoke() {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

async function getLLMReply(message) {
  // Step 1: Build the request to the proxy server.
  const endpoint = 'https://vibe-proxy-gqv4.onrender.com/v1/chat/completions';

  // Step 2: Set the exact headers required by the classroom proxy.
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer sk-vibe-summer-2026'
  };

  // Step 3: Put the user's prompt into the request body in the expected JSON shape.
  const body = JSON.stringify({
    model: 'class-chat-model',
    messages: [
      { role: 'user', content: message }
    ]
  });

  // Step 4: Send the POST request with fetch().
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body
  });

  // Step 5: If the server does not respond successfully, stop and throw an error.
  if (!response.ok) {
    throw new Error('The classroom proxy request failed.');
  }

  // Step 6: Parse the response JSON and read the AI answer from the expected path.
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

function bootUp() {
  isOn = true;
  document.body.classList.add('active');
  chatCard.classList.add('active');
  statusText.textContent = 'Joke mode on';
  document.querySelector('.dot').style.background = '#22c55e';
  addMessage('The lights are on, the laughter is ready. Ask me for a joke!', 'bot');
}

powerBtn.addEventListener('click', () => {
  if (!isOn) {
    bootUp();
  } else {
    isOn = false;
    document.body.classList.remove('active');
    chatCard.classList.remove('active');
    statusText.textContent = 'Offline';
    document.querySelector('.dot').style.background = '#ef4444';
    addMessage('The joke machine took a nap. Press me again when you want more laughs.', 'bot');
  }
});

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!isOn) {
    bootUp();
  }

  const prompt = userInput.value.trim();
  if (!prompt) return;

  addMessage(prompt, 'user');
  userInput.value = '';

  try {
    const llmReply = await getLLMReply(prompt);
    const response = llmReply || `Absolutely! ${getRandomJoke()}`;
    addMessage(response, 'bot');
  } catch (error) {
    addMessage('The AI request did not work, so I’m falling back to a joke. ' + getRandomJoke(), 'bot');
  }
});

chips.forEach((chip) => {
  chip.addEventListener('click', async () => {
    if (!isOn) {
      bootUp();
    }

    const prompt = chip.dataset.prompt;
    addMessage(prompt, 'user');

    try {
      const llmReply = await getLLMReply(prompt);
      addMessage(llmReply ? llmReply : `You got it! ${getRandomJoke()}`, 'bot');
    } catch (error) {
      addMessage(`You got it! ${getRandomJoke()}`, 'bot');
    }
  });
});
