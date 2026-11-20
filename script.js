// Mensajes que aparecen al tocar el corazón.
    const phrases = [
      'Presiona el corazón',
      'Sigue presionando',
      'Vas bien ✨',
      'Ya casi…',
      'La última vez ❤️'
    ];

    let taps = 0;
    const heart = document.getElementById('heart');

    heart.addEventListener('click', () => {
      taps++;
      heart.classList.remove('pulse');
      void heart.offsetWidth;
      heart.classList.add('pulse');

      document.getElementById('heartMessage').textContent =
        phrases[Math.min(taps, phrases.length) - 1] || '¡Lo lograste!';
      document.getElementById('heartHint').textContent = `${Math.min(taps, 5)} / 5`;

      if (taps >= 5) {
        document.getElementById('unlock').classList.remove('hidden');
        document.getElementById('heartMessage').textContent =
          'Ahora sí… bienvenida a nuestra historia ❤️';
        document.getElementById('heartHint').textContent = '';
      }
    });

    // Las fotos cargadas desde el selector sirven como vista previa local.
    function loadPhoto(input, id) {
      if (input.files && input.files[0]) {
        const url = URL.createObjectURL(input.files[0]);
        document.getElementById(id).src = url;
        document.getElementById(id).style.opacity = '1';
      }
    }

    // Reproductor del casete.
    const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const tape = document.getElementById('tape');

playBtn.addEventListener('click', async () => {
    try {
        if (audio.paused) {
            await audio.play();

            playBtn.textContent = '❚❚ PAUSE';
            tape.classList.add('playing');

        } else {
            audio.pause();

            playBtn.textContent = '▶ PLAY';
            tape.classList.remove('playing');
        }

    } catch (error) {
        console.error('No se pudo reproducir la canción:', error);
        alert('No se pudo reproducir la canción. Revisa el archivo de audio.');
    }
});

audio.addEventListener('ended', () => {
    playBtn.textContent = '▶ PLAY';
    tape.classList.remove('playing');
});

audio.addEventListener('pause', () => {
    tape.classList.remove('playing');
});

audio.addEventListener('play', () => {
    tape.classList.add('playing');
});

    // Sorteo aleatorio sin repetir premios hasta agotar la lista.
    function createPrizeBag(prizeList) {
      let bag = [];

      function refill() {
        bag = [...prizeList];
        // Mezcla Fisher-Yates: cada premio queda en un orden aleatorio.
        for (let i = bag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [bag[i], bag[j]] = [bag[j], bag[i]];
        }
      }

      return function drawPrize() {
        if (bag.length === 0) refill();
        return bag.pop();
      };
    }

    // Los tres regalos se eligen al azar, sin repetirse hasta revelar los tres.
    const gift = document.getElementById('gift');
    const reveal = document.getElementById('giftReveal');
    const giftPrizes = [
      'Elegir algo de Shein 🛍️',
      'Elegir zapatos o tenis nuevos 👟',
      'Un regalo libre de tu elección 🎁'
    ];
    const drawGift = createPrizeBag(giftPrizes);

    gift.addEventListener('click', () => {
      const selectedGift = drawGift();
      document.getElementById('giftText').textContent = selectedGift;
      gift.classList.add('gift-open');

      setTimeout(() => {
        gift.classList.add('hidden');
        reveal.classList.remove('hidden');
        document.getElementById('resetGift').style.display = 'inline-block';
      }, 650);
    });

    document.getElementById('resetGift').addEventListener('click', () => {
      gift.classList.remove('hidden', 'gift-open');
      reveal.classList.add('hidden');
      document.getElementById('giftText').textContent = 'Tu sorpresa está esperando… ❤️';
      document.getElementById('resetGift').style.display = 'none';
    });

    // La ruleta contiene únicamente los seis premios acordados.
    // No repite premios hasta que todos hayan salido; después inicia otra ronda.
    const prizes = [
      'Ir al cine 🎬',
      'Ir por elotes 🌽',
      'Salir a bailar 💃',
      'Ir a comer a tu restaurante favorito 🍽️',
      'Ir a comer tacos 🌮',
      'Entre los dos elegir un restaurante nuevo 🥂'
    ];
    const drawWheelPrize = createPrizeBag(prizes);
    let spinning = false;
    let wheelTurns = 0;

    document.getElementById('spin').addEventListener('click', () => {
      if (spinning) return;
      spinning = true;

      const selectedPrize = drawWheelPrize();
      const wheel = document.getElementById('wheel');
      wheelTurns += 1;
      wheel.style.transform = `rotate(${1440 + wheelTurns * 360 + Math.random() * 360}deg)`;
      document.getElementById('wheelResult').textContent = 'Girando…';

      setTimeout(() => {
        document.getElementById('wheelResult').textContent = `Te toca: ${selectedPrize}`;
        spinning = false;
      }, 4100);
    });

    // Carrusel de ideas para el próximo año.
    const slides = [...document.querySelectorAll('.slide')];
    const dots = document.getElementById('dots');
    let current = 0;

    slides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Mostrar diapositiva ' + (index + 1));
      dot.onclick = () => showSlide(index);
      dots.appendChild(dot);
    });

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, position) => {
        slide.classList.toggle('active', position === current);
      });
      [...dots.children].forEach((dot, position) => {
        dot.classList.toggle('active', position === current);
      });
    }

    document.getElementById('prevSlide').onclick = () => showSlide(current - 1);
    document.getElementById('nextSlide').onclick = () => showSlide(current + 1);

    // Descarga de la carta en formato TXT.
    function downloadText() {
      const title = document.getElementById('letterTitle').value || 'Carta';
      const text = document.getElementById('letterText').value;
      const blob = new Blob([title + '\n\n' + text], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'carta-para-diana.txt';
      link.click();
      URL.revokeObjectURL(link.href);
    }

    // Autoguardado del borrador en este navegador.
    const letterTitleInput = document.getElementById('letterTitle');
    const letterTextInput = document.getElementById('letterText');
    const letterSaveStatus = document.getElementById('letterSaveStatus');

    try {
      letterTitleInput.value = localStorage.getItem('dianaLetterTitle') || letterTitleInput.value;
      letterTextInput.value = localStorage.getItem('dianaLetterText') || letterTextInput.value;
    } catch (error) {
      // El navegador puede bloquear el almacenamiento local.
    }

    function saveLetterDraft() {
      try {
        localStorage.setItem('dianaLetterTitle', letterTitleInput.value);
        localStorage.setItem('dianaLetterText', letterTextInput.value);
        letterSaveStatus.textContent = 'Borrador guardado automáticamente en este navegador ✓';
      } catch (error) {
        letterSaveStatus.textContent = 'No se pudo guardar automáticamente; descarga una copia para conservarla.';
      }
    }

    letterTitleInput.addEventListener('input', saveLetterDraft);
    letterTextInput.addEventListener('input', saveLetterDraft);
    document.getElementById('downloadLetter').onclick = downloadText;

    // Abre una versión limpia de la carta para imprimirla o guardarla como PDF.
    document.getElementById('printLetter').onclick = () => {
      const title = document.getElementById('letterTitle').value;
      const text = document.getElementById('letterText').value;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Georgia, serif; max-width: 700px; margin: 70px auto; line-height: 1.9; color: #38212b; padding: 20px; }
              h1 { font-weight: normal; }
              p { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <p>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    };
