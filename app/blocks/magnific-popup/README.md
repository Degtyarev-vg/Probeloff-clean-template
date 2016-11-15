# Блок magnific-popup
Содержит css стили анимации и js вызов для плагина [magnific-popup](http://dimsemenov.com/plugins/magnific-popup/)  
В данный момент используется анимация "разворачивания" окна, но можно использовать анимацию с эффектом "zoom", для этого нужно закоментировать следующие строки:
```
$('.popup-with-move-anim').magnificPopup({
и
mainClass: 'my-mfp-slide-bottom'
```
а также раскоментировать:
```
$('.popup-with-zoom-anim').magnificPopup({
и
//mainClass: 'my-mfp-zoom-in'
```
затем в ссылке вызова popup использовать класс `popup-with-zoom-anim` вместо `popup-with-move-anim`.