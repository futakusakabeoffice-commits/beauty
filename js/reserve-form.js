// Booking forms (index.html #home-reserve-form / reserve.html #reserve-form).
// TODO: 送信先（予約システム・メール送信API）が決まったら、ここで送信処理を行う。
// 現状はデザインどおり表示を切り替えるのみで、入力内容はどこにも送信されない。
(function () {
  // Top page: swap the button label to a sent message.
  var homeForm = document.getElementById('home-reserve-form');
  if (homeForm) {
    var button = homeForm.querySelector('.form__submit');
    var status = document.getElementById('home-reserve-status');
    var sentText = '送信しました。確認のご連絡をお待ちください';
    homeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      button.querySelector('.form__submit-label').textContent = sentText;
      button.disabled = true;
      status.textContent = sentText;
    });
  }

  // Reserve page: replace the form with the completion screen.
  var form = document.getElementById('reserve-form');
  if (form) {
    var thanks = document.getElementById('reserve-thanks');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.hidden = true;
      thanks.hidden = false;
      thanks.focus();
    });
  }
})();
