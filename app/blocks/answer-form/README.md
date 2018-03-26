# Блок answer-form для ответа на отправленную форму в виде popup
Работает на основе плагина [magnific-popup](http://dimsemenov.com/plugins/magnific-popup/).
### Содержание jade файла
```
mixin answer-form()
	+b.answer-form.zoom-anim-dialog.mfp-hide#answer-form&attributes(attributes)
		+e('p').header Ваша заявка принята
		+e('p').subheader Мы свяжемся с вами в ближайшее время
		+e('a')(href='#').ok Ок

	+b('a')(href='#answer-form').popup-with-move-anim.answer-form-show.hidden
```
преобразуется в следующий html код:
```
<div id="answer-form" class="answer-form zoom-anim-dialog mfp-hide">
    <p class="answer-form__header">Ваша заявка принята</p>
    <p class="answer-form__subheader">Мы свяжемся с вами в ближайшее время</p>
    <a href="#" class="answer-form__ok">Ок</a>
</div>

<a href="#answer-form" class="popup-with-move-anim answer-form-show hidden"></a>
```
Класс `zoom-anim-dialog` - придает анимацию при открытии/закрытии.  
Класс `mfp-hide` - скрывает форму.

Ссылка
```
<a href="#answer-form" class="popup-with-move-anim answer-form-show hidden"></a>
```
использууется для вызова самого popup, т.е. при клике на данную ссылку появится popup с id="answer-form".  
Класс `popup-with-move-anim` в ссылке также предназначен для вызова popup.  
Класс `answer-form-show` - используется в качестве обращения к ссылке при клике.  
Класс `hidden` - скрывает ссылку (display: none).
### Содержание scss файла
Содержит в себе стилевое оформление блока answer-form.
### Содержание js файла
```
$('.answer-form__ok').click(function(){
	$.magnificPopup.close();
	return false;
});
```
При клике на кнопку с классом `answer-form__ok` закрываем popup, а также убираем дефолтное поведение ссылки.
### Использование
1. В нужном месте jade файла вызвать данный миксин: `+answer-form`
2. При нужном действии запускать событие клика по ссылке с классом `answer-form-show` - будет выведен popup с id, который указан в атрибуте href данной ссылки.
