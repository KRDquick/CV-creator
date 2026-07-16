const menuButton = document.querySelector('.menu-button');
let menu = document.querySelector('.right-side-option01');
menuButton.addEventListener('click', () => {
  if (menu.classList.contains('right-side-option01')){
    menu.classList.remove('right-side-option01');
    menu.classList.add('right-side-option02');
  } else if (menu.classList.contains('right-side-option02')){
    menu.classList.add('right-side-option01');
    menu.classList.remove('right-side-option02');
  }
});
let titles = ['سیــــڤــــیەکــــەم', 'ماڵەوە', 'دیزاینەکان', 'پێشنیارکردن', 'پەیوەندی کردن بە ستاف'];
setInterval(function changeTitle(){
  for (i=0;i<titles.length;i++){
    if (i = titles[0]){
      document.querySelector('.js-title-puls').innerHTML = `کڵێشەکان`
    }
  }
}, 1000);
setInterval(function changeTitle(){
  for (i=0;i<titles.length;i++){
    if (i = titles[1]){
      document.querySelector('.js-title-puls').innerHTML = 'سیــــڤــــیەکــــەم'
    }
  }
}, 2000);
document.querySelectorAll('.CV-design').forEach((showImage) => {
  showImage.addEventListener('click', () => {
    window.open(showImage.dataset.preview, '_blank');
  });
});
document.querySelectorAll('.choose-button').forEach((button) => {
  button.addEventListener('click', () => {
    const file = button.dataset.file;

    const link = document.createElement('a');
    link.href = file;
    link.download = '';
    link.click();
  });
});