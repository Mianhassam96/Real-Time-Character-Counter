document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('textarea');
  const totalCounter = document.getElementById('total-counter');
  const totalWords = document.getElementById('total-words');
  const remainingCounter = document.getElementById('remaining-counter');
  const progressBar = document.getElementById('progress-bar');
  const copyBtn = document.getElementById('copy-btn');
  const resetBtn = document.getElementById('reset-btn');
  const voiceBtn = document.getElementById('voice-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const charLimitInput = document.getElementById('char-limit');

  let maxChars = 5000;

  // Retrieve saved text from localStorage if available
  const savedText = localStorage.getItem('text');
  if (savedText) {
    textarea.value = savedText;
  }

  // Update the max character limit
  charLimitInput.addEventListener('input', (e) => {
    maxChars = parseInt(e.target.value, 10);
    updateCounters();
  });

  // Function to update the counters and progress bar
  function updateCounters() {
    const text = textarea.value;
    const totalChars = text.length;
    const totalWordsCount = text.trim().split(/\s+/).filter(Boolean).length;
    const remainingChars = maxChars - totalChars;

    totalCounter.textContent = totalChars;
    totalWords.textContent = totalWordsCount;
    remainingCounter.textContent = remainingChars;

    // Update the progress bar width
    const progress = (totalChars / maxChars) * 100;
    progressBar.style.width = `${progress}%`;

    // Change progress bar color when nearing the limit
    if (progress >= 90) {
      progressBar.style.backgroundColor = '#dc3545'; // Red color when near limit
    } else {
      progressBar.style.backgroundColor = '#28a745'; // Green by default
    }

    // Save content to localStorage after any changes
    localStorage.setItem('text', text);

    // Character limit color change
    if (totalChars >= maxChars * 0.9) {
      remainingCounter.style.color = '#dc3545'; // Red when close to limit
    } else {
      remainingCounter.style.color = '#ffc107'; // Default yellow
    }
  }

  // Handle copying text to clipboard
  copyBtn.addEventListener('click', () => {
    textarea.select();
    document.execCommand('copy');
    alert('Text copied to clipboard!');
  });

  // Handle reset button
  resetBtn.addEventListener('click', () => {
    textarea.value = '';
    updateCounters();
  });

  // Handle Speech-to-Text functionality
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    voiceBtn.addEventListener('click', () => {
      recognition.start();
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      textarea.value += transcript;
      updateCounters();
    };
  } else {
    voiceBtn.disabled = true; // Disable voice button if SpeechRecognition is not supported
  }

  // Toggle dark mode
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  // Event listener to update counters in real-time
  textarea.addEventListener('input', updateCounters);

  // Initialize counters on page load
  updateCounters();
});
