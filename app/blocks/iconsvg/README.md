# Блок iconsvg
Миксин для использования svg спрайта.  
### Содержание pug файла
```
mixin iconsvg(iconName)
	+b('svg').iconsvg&attributes(attributes)
		use(xlink:href='img/svg-sprite.svg##{iconName}')
```
преобразуется в следующий html код:
```
<svg class="iconsvg">
  <use xlink:href="img/svg-sprite.svg#undefined"></use>
</svg>
```
Значение undefined из-за того, что не был указан аргумент при вызове.
### Использование
В нужном месте pug файла вызвать данный миксин: `+iconsvg('same-icon')`. В качестве единственного аргумента в виде строки указать *название svg иконки*.  
Пример:  
добавим иконку с названием `same-icon`, а также добавим класс `same-class`
```
+iconsvg('same-icon').same-class
```
преобразуется в следующий html код:
```
<svg class="iconsvg same-class">
  <use xlink:href="img/svg-sprite.svg#same-icon"></use>
</svg>
```
