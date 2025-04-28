const textInput = document.getElementById('text-input');
const speakBtn = document.getElementById('speak-btn');
const voiceSelect = document.getElementById('voice-select');
const progressBar = document.getElementById('progress-bar');

let speech = new SpeechSynthesisUtterance();
let voices = [];

function populateVoices() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

// Corrigir bug de não carregar vozes
populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}

voiceSelect.addEventListener('change', () => {
    speech.voice = voices[voiceSelect.value];
});

speakBtn.addEventListener('click', () => {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    speech.text = textInput.value;
    speech.voice = voices[voiceSelect.value];
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    progressBar.style.width = '0%';
    speechSynthesis.speak(speech);

    // Deixa o botão animado enquanto fala
    speakBtn.classList.add('speaking');

    // Barra de progresso fake (não é 100% exata mas é visual)
    let progress = 0;
    const interval = setInterval(() => {
        if (!speechSynthesis.speaking) {
            clearInterval(interval);
            progressBar.style.width = '100%';
            speakBtn.classList.remove('speaking');
        } else {
            progress = Math.min(progress + 1, 95);
            progressBar.style.width = progress + '%';
        }
    }, 100);
});
