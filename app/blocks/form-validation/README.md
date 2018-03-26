# Блок form-validation
Используется для любых форм, в которых нужно валидировать какие-либо поля.  
Валидация реализована на основе плагина [jQuery Validation Plugin](https://jqueryvalidation.org/).
### Содержание pug файла
```
mixin form-validation(projectName, formSubject)
  +b('form').form-validation&attributes(attributes)
    input(type='hidden' name='project_name' value=projectName || 'Название проекта')
    input(type='hidden' name='form_subject' value=formSubject || 'Название формы')
    block
```
### Содержание scss файла
Класс `form-validation` содержит стилевое оформление формы.  
Элемент `form-validation__group` спозиционирован относительно для того, чтобы при добавлении модификаторов `form-validation__group_valid` - ошибок в поле нет и `form-validation__group_invalid` - ошибки есть, могли абсолютно спозиционировать соответствующую иконку (успеха или ошибки) через превдоэлемент `&:after`.  
Соответствующие иконки спозиционированы через превдоэлемент `&:after` именно в элементе `form-validation__group` через модификаторы `form-validation__group_valid` и `form-validation__group_invalid` из за того, что в тегах input нельзя использовать псевдоэлементы [w3.org](https://www.w3.org/TR/CSS21/selector.html#before-and-after).  
Элемент `form-validation__error-text` - придает стилевое оформление ошибке, которая выводится в виде текста.
### Содержание js файла
```
$(".form-validation").each( function() {
  var thisButton = $(this).find('button[type="submit"]');
  $(this).validate({
    highlight: function(element, errorClass) {
        $(element).parent().removeClass('form-validation__group_valid').addClass("form-validation__group_invalid");
        $(element).removeClass('validation_valid').addClass("validation_invalid");
    },
    unhighlight: function(element, errorClass) {
        $(element).parent().removeClass('form-validation__group_invalid').addClass("form-validation__group_valid");
        $(element).addClass('validation_valid').removeClass("validation_invalid");
    },
    errorElement: "span",
    errorClass: "form-validation__error-text",
    //validClass: "success",
    ignore: ".validation_ignore",
    //focusCleanup: true,
    focusInvalid: false,
    /*errorPlacement: function(error, element){
      return true;
    },*/
    submitHandler: function(form) {
      var th = $(form);
      $.ajax({
        type: "POST",
        url: "./mail.php", 
        data: th.serialize()
      }).done(function(response) {
        thisButton.attr('disabled', 'disabled');
        $('.answer-form-show').click();
        setTimeout(function() {
          th.trigger("reset");
          thisButton.removeAttr('disabled');
          th.find('.validation_valid').removeClass('validation_valid');
          th.find('.form-validation__group_valid').removeClass('form-validation__group_valid');
        }, 3000);
      });
      return false;
    }
  });
});
```
С помощью цикла `each` проходимся по **каждой** форме, которая содержит класс `form-validation` и вызываем валидацаю при помощи плагина [jQuery Validation Plugin](https://jqueryvalidation.org/);  
В переменную `thisButton` помещаем текущую кнопку отправки:
```
var thisButton = $(this).find('button[type="submit"]');
```
которую в дальнейшем при **успешной** отправке заблокируем:
```
thisButton.attr('disabled', 'disabled');
```
и через 3 секунды разблокируем:
```
thisButton.removeAttr('disabled');
```
Это нужно для того, чтобы при успешной отправке пользователь не нажал на кнопку отправки несколько раз, из-за чего форма отправится также несколько раз. На несколько нажатий пользователя может побудить не моментальный ответ от сервера, из-за чего может сложиться мнение, что кнопка нажата не была, и, соответственно, он нажмет ее ещё.
___
```
highlight: function(element, errorClass) {
    $(element).parent().removeClass('form-validation__group_valid').addClass("form-validation__group_invalid");
    $(element).removeClass('validation_valid').addClass("validation_invalid");
}
```
Действия с неправильно заполненными полями.
```
$(element).parent().removeClass('form-validation__group_valid').addClass("form-validation__group_invalid");
```
У элемента, в котором возникла ошибка ищем родителя, удаляем класс `form-validation__group_valid` если он есть и добавляем класс `form-validation__group_invalid`.
```
$(element).removeClass('validation_valid').addClass("validation_invalid");
```
У элемента, в котором возникла ошибка удаляем класс `validation_valid` если он есть и дабавляем класс `validation_invalid`.
___
```
unhighlight: function(element, errorClass) {
    $(element).parent().removeClass('form-validation__group_invalid').addClass("form-validation__group_valid");
    $(element).addClass('validation_valid').removeClass("validation_invalid");
}
```
Когда ошибок нет отменяем действия, заданные в `highlight`.
```
$(element).parent().removeClass('form-validation__group_invalid').addClass("form-validation__group_valid");
```
У элемента, в котором больше нет ошибок ищем родителя, удаляем класс `form-validation__group_invalid` если он есть и добавляем класс `form-validation__group_valid`.
```
$(element).addClass('validation_valid').removeClass("validation_invalid");
```
У элемента, в котором больше нет ошибок добавляем класс `validation_valid` и удаляем класс `validation_invalid` если он есть.
___
```
errorElement: "span"
```
В какой тег заключать текстовую ошибку.
___
```
errorClass: "form-validation__error-text"
```
Какой класс присваивать тестовой ошибке, которая выводится в теге заданным через `errorElement`.
___
```
ignore: ".validation_ignore"
```
Для того, чтобы игнорировать валидацию - нужному элементу добавить класс `validation_ignore` и оно будет проигнорированно, даже если в нем заданы правила для валидации.
___
```
focusCleanup: true
```
Когда в поле содержится ошибка, то при **фокусе** ошибка не пропадает до мемента, пока она не будет исправлена. Данная опция в занчении true при фокусе удаляет классы ошибок и дабавляет классы валидности.
___
```
focusInvalid: true
```
При нажатии на кнопку отправки, если в каком-либо поле возникла ошибка, то будет автоматически поставлен фокус в данное поле.  
Если ошибка возникла в нескольких полях, то фокус будет поставлен в первое по счету поле с ошибкой.
___
```
errorPlacement: function(error, element){
  return true;
}
```
Если ошибки в виде текста выводить **не нужно**, то нужно добавить данную функцию. В данный момент текстовые ошибки выводятся, поэтому данная функция закомментирована.
___
```
submitHandler: function(form) {
  var th = $(form);
  $.ajax({
    type: "POST",
    url: "./mail.php", 
    data: th.serialize()
  }).done(function(response) {
    thisButton.attr('disabled', 'disabled');
    $('.answer-form-show').click();
    setTimeout(function() {
      th.trigger("reset");
      thisButton.removeAttr('disabled');
      th.find('.validation_valid').removeClass('validation_valid');
      th.find('.form-validation__group_valid').removeClass('form-validation__group_valid');
    }, 3000);
  });
  return false;
}
```
Ajax обработка формы.
### Использование
1. В нужном месте pug файла вызвать данный миксин: `+form-validation('projectName','formSubject')`. В качестве первого аргумента в виде строки указать *название проекта* в качестве второго аргумента в виде строки указать *название формы*.
Пример:
```
+form-validation('Тестовый проект', 'Тестовая форма')
```
преобразуется в следующий html код:
```
<form class="form-validation">
    <input type="hidden" name="project_name" value="Тестовый проект"/>
    <input type="hidden" name="form_subject" value="Тестовая форма"/>
</form>
```
Данные два input'а с атрибутом type="hidden" скрыто передаются в форме, по которым проходится скрипт отправки почты написанным на php, и в дальнейшем помогают понять администратору с какого сайта пришла заявка и с какой именно формы. Каждой форме можно и даже нужно давать своё уникальное название.
2. Дописываем нужные классы форме, а также нужные поля. Например:
```
+form-validation('Тестовый проект', 'Тестовая форма').form-header
  +e.group
    +b('input')(type='text' name='Электронная_почта' placeholder='Ваш email').input.validation._email
  +e.group
    +b('input')(type='text' name='Имя' placeholder='Вашe имя').input.validation._rangelength
  +e.group
    +b('input')(type='text' name='Телефон' placeholder='Ваш телефон').input
  +e.group
    +b('textarea')(name='Сообщение' placeholder='Ваше сообщение').textarea
  +b('button')(type='submit') Отправить
```
преобразуется в следующий html код:
```
<form class="form-validation form-header">
  <input type="hidden" name="project_name" value="Тестовый проект"/>
  <input type="hidden" name="form_subject" value="Тестовая форма"/>
  <div class="form-validation__group">
    <input type="text" name="Электронная_почта" placeholder="Ваш email" class="input validation validation_email"/>
  </div>
  <div class="form-validation__group">
    <input type="text" name="Имя" placeholder="Вашe имя" class="input validation validation_rangelength"/>
  </div>
  <div class="form-validation__group">
    <input type="text" name="Телефон" placeholder="Ваш телефон" class="input"/>
  </div>
  <div class="form-validation__group">
    <textarea name="Сообщение" placeholder="Ваше сообщение" class="textarea"></textarea>
  </div>
  <button type="submit">Отправить
  </button>
</form>
```
