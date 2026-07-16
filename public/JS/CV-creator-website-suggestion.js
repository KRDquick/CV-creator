const popup = document.querySelector('.js-popup-overlay');
const popupTitle = document.querySelector('.popup-title');
const popupMessage = document.querySelector('.js-popup-message');
const popupButton = document.querySelector('.js-popup-button');
const menuButton = document.querySelector('.menu-button');
let menu = document.querySelector('.right-side-option01');
menuButton.addEventListener('click', () => {
  if (menu.classList.contains('right-side-option01')) {
    menu.classList.remove('right-side-option01');
    menu.classList.add('right-side-option02');
  } else {
    menu.classList.add('right-side-option01');
    menu.classList.remove('right-side-option02');
  }
});
let titles = [
  'سیــــڤــــیەکــــەم',
  'ماڵەوە',
  'دیزاینەکان',
  'پێشنیارکردن',
  'پەیوەندی کردن بە ستاف'
];
setInterval(() => {
  document.querySelector('.js-title-puls').innerHTML = 'پێشنیارکردن';
}, 1000);
setInterval(() => {
  document.querySelector('.js-title-puls').innerHTML = 'سیــــڤــــیەکــــەم';
}, 2000);
const button = document.querySelector('.js-button');
const upload = document.querySelector('.js-upload');
button.addEventListener('click', () => {
  upload.click();
});
const fileList = document.querySelector('.js-file-list');
let uploadedFiles = [];
upload.addEventListener('change', () => {
  for (const file of upload.files) {
    const duplicate = uploadedFiles.some(existing =>
      existing.name === file.name &&
      existing.size === file.size
    );
    if (!duplicate) {
      uploadedFiles.push(file);
    }
  }
  renderFiles();
  upload.value = '';
});
function renderFiles() {
  fileList.innerHTML = '';
  if (uploadedFiles.length === 0) {
    fileList.innerHTML = `
      <div class="empty">
        <p dir="rtl" class="nothing-yet">
          هیچ شتێك زیادنەکراوە.
        </p>
      </div>
    `;
    return;
  }
  uploadedFiles.forEach((file, index) => {
    const card = document.createElement('div');
    card.className = 'file-card';
    const sizeKB = (file.size / 1024).toFixed(2);
    card.innerHTML = `
      <div class="file-info">
        <div class="file-name">
          ${file.name}
        </div>
        <div class="file-size">
          ${sizeKB} KB
          <br>
          ${file.type || 'Unknown type'}
        </div>
      </div>
      <div class="buttons">
        <button class="open-btn">
          بیکەوە
        </button>
        <button class="delete-btn">
          بیسڕەوە
        </button>
        <button class="send-btn">
          بینێرە
        </button>
      </div>
    `;
    const openBtn = card.querySelector('.open-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    const sendBtn = card.querySelector('.send-btn');
    openBtn.addEventListener('click', () => {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    });
    deleteBtn.addEventListener('click', () => {
      uploadedFiles.splice(index, 1);
      renderFiles();
    });
    sendBtn.addEventListener('click', () => {
      const contact = document.querySelector('.js-contact').value.trim();
      if (contact === '') {
        popupTitle.textContent = 'ببوورە';
        popupMessage.textContent =
          'ناتوانیت بەبێ نووسینی هەژماری تێلێگرامەکەت یان ژمارەی مۆبایلەکەت کڵێشەکەت بنێریت.';
        popup.style.display = 'flex';
        return;
      }
      const formData = new FormData();
      formData.append('contact', contact);
      formData.append('template', file);
      fetch('/suggest-template', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(message => {
        popupTitle.textContent = 'سەرکەوتوو بوو';
        popupMessage.textContent = message;
        popup.style.display = 'flex';
        document.querySelector('.js-contact').value = '';
        uploadedFiles.splice(index, 1);
        renderFiles();
      });
    });
    fileList.appendChild(card);
  });
}
popupButton.addEventListener('click', () => {
  popup.style.display = 'none';
});