const menuButton = document.querySelector('.menu-button');
let menu = document.querySelector('.right-side-option01');
menuButton.addEventListener('click', () => {
  if (menu.classList.contains('right-side-option01')) {
    menu.classList.remove('right-side-option01');
    menu.classList.add('right-side-option02');
  } else if (menu.classList.contains('right-side-option02')) {
    menu.classList.add('right-side-option01');
    menu.classList.remove('right-side-option02');
  }
});
setInterval(() => {
  document.querySelector('.js-title-puls').innerHTML = 'کارگێڕی';
}, 1000);
setInterval(() => {
  document.querySelector('.js-title-puls').innerHTML = 'سیــــڤــــیەکــــەم';
}, 2000);
fetch('/api/submissions')
  .then(response => response.json())
  .then(submissions => {
    const pendingTable = document.querySelector('.js-pending-table');
    const acceptedTable = document.querySelector('.js-accepted-table');
    submissions.forEach(submission => {
      if (submission.status === 'pending') {
        pendingTable.innerHTML += `
          <tr>
            <td>${submission.contact}</td>
            <td>
              <a href="/download/${submission.id}">
                ${submission.original_name}
              </a>
            </td>
            <td>${new Date(submission.created_at).toLocaleString()}</td>
            <td>
              <button
                class="accept-btn"
                data-id="${submission.id}">
                وەرگرتن
              </button>
              <button
                class="reject-btn"
                data-id="${submission.id}">
                ڕەتکردنەوە
              </button>
            </td>
          </tr>
        `;
      } else if (submission.status === 'accepted') {
        acceptedTable.innerHTML += `
          <tr>
            <td>${submission.contact}</td>
            <td>
              <a href="/download/${submission.id}">
                ${submission.original_name}
              </a>
            </td>
            <td>${new Date(submission.created_at).toLocaleString()}</td>
          </tr>
        `;
      }
    });
    document.querySelectorAll('.accept-btn').forEach(button => {
      button.addEventListener('click', () => {
        fetch('/accept-template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: button.dataset.id
          })
        })
        .then(response => response.json())
        .then(() => {
          location.reload();
        });
      });
    });
    document.querySelectorAll('.reject-btn').forEach(button => {
      button.addEventListener('click', () => {
        fetch('/reject-template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: button.dataset.id
          })
        })
        .then(response => response.json())
        .then(() => {
          location.reload();
        });
      });
    });
  });