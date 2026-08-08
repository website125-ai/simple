const button = document.querySelector('#helloButton');
const message = document.querySelector('#message');

button.addEventListener('click', () => {
  message.textContent = '很高兴认识你，祝你今天一切顺利！';
  button.textContent = '已收到问候 ✨';
});
