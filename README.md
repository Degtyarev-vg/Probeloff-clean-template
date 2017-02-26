# Стартовый проект для frontend-разработки

Шаблон для быстрого старта разработки с [Gulp](http://gulpjs.com/), [Jade](https://pugjs.org/api/getting-started.html) и [Sass](http://sass-scss.ru/)

### Возможности
* Быстрый и удобный сборщик gulp
* Jade миксины для короткой записи классов по БЭМ технологии
* Легко настраиваемая сетка по БЭМ технологии
* Сборка svg спрайтов
* Сборка png спрайтов
* Сервер и синхронное тестирование сайта в браузерах
* Шаблонизатор Jade
* Конкатенация и минификация JavaScript файлов
* Конкатенация и минификация css файлов
* Склейка @media и перенос в конец файла
* Авто-подстановка вендорных префиксов в CSS
* Препроцессор Sass
* Библиотека миксинов [boubon](http://bourbon.io/) для Sass
* Оптимизация изображений
* Перехват и вывод ошибок без остановки gulp
* Оптимизированная сборка проекта на production с помощью одной команды
* Постоянно расширяемая библиотека миксинов блоков для повторного использования блоков

### Быстрый старт
* Установить [node.js](https://nodejs.org/en/)
* Установить gulp глобально (один раз!)
```
    npm i -g gulp
```
* Склонировать проект либо [скачать архив](https://github.com/Degtyarev-vg/Probeloff-clean-template/archive/master.zip)
```
    git clone https://github.com/Degtyarev-vg/Probeloff-clean-template.git
```
* Установить зависимости
```
    npm i
```
* Запустить gulp
```
    gulp
```
* В браузере откроется страница с проектом, по адрессу http://localhost:3000/

### Команды (таски) gulp
* gulp - запуск сервера на порту http://localhost:3000/ и вотчеров
* gulp clearcache - очистка кэша
* NODE_ENV=production gulp build - сборка проекта для production
* gulp svg-sprite - сборка svg спрайта
* gulp png-sprite - сборка png спрайта

ОБРАТИТЕ ВНИМАНИЕ! Команды для сборки png и svg спрайтов нужно запускать тогда, когда при удалении/добавлении изображения не сработал вотчер на автоматическую пересборку - в остальных случаях спрайт генерируется сам при удалении/добавлении изображении.

### Cоздание нового блока
Проект построен таким образом, что каждый логический кусочек кода (блок) лежит в своей директории.

В jade файле создается миксин для дальнейшего использования и расширения с последующим преобразованием в html код. 

В scss файле прописываются стили для данного блока с последующей компиляцией в css, а в js файле приписываются скрипт(ы). 

```
# формат: node createBlock.js [имя файла подключения импорта scss] [имя блока] [доп. расширения через пробел]
node createBlock.js includes.scss block                                           # создаст только папку блока block и в ней файл block.scss. Файл block.scss будет заимпортирован в файл подключения includes.scss
node createBlock.js new-block jade js                                    # создаст папку блока new-block и в ней new-block.scss, new-block.jade, new-block.js
node createBlock.js new-block js [доп. расширения через пробел]     # создаст папку блока new-block и в ней new-block.scss, new-block.jade, new-block.js, а также файлы с другими дополнительно указанными расширениями
```
По умолчанию будет создан .scss файл, в него будет записан стартовый контент.

для scss:
```
// Для импорта в файл подключения: @import './app/blocks*/new-block/new-block.scss';

@import '../../scss/vars.scss';     // файл с переменными
@import '../../scss/png-sprite';    // файл с png-спрайтами
@import 'bourbon';

.new-block {
}
```
Если дополнительно будет создан jade файл, то в него по умолчанию запишется:
```
mixin new-block()
    +b.new-block&attributes(attributes)
        block
```
Если дополнительно будет создан js файл, то в него по умолчанию запишется:
```
$(document).ready(function() {
    // код
});
```
Если дополнительно будет создан json файл, то в него по умолчанию запишется:
```
{
    
}
```

Если блок уже существует, то файлы не будут затёрты, но создадутся те файлы, которые ещё не существуют.

После создания блока, в основные файлы подключений будет дописана (в самый низ) строка импорта файла с соответствующим расширением.

### Структура проекта

```
block/                              # Библиотека блоков для всех проектов
    bemto/                          # Библиотека миксинов для удобного именования БЭМ терминами
    .../                            # Реализация блоков в технологии jade, scss [другие расширения]
    includes.jade                   # Файл подключения всех jade файлов с уровня block/
    includes.js                     # Файл подключения всех js файлов с уровня block/
    includes.scss                   # Файл подключения всех scss файлов с уровня block/
blocks.project/                     # Библиотека блоков уровня проекта
    .../                            # Реализация блоков в технологии jade, scss [другие расширения]
    includes.jade                   # Файл подключения всех jade файлов с уровня blocks.project/ а также импорт блоков уровня block/
    includes.js                     # Файл подключения всех js файлов с уровня blocks.project/ а также импорт блоков уровня block/
    includes.scss                   # Файл подключения всех scss файлов с уровня blocks.project/ а также импорт блоков уровня block/
    header.scss                     # Файл подключения всех scss файлов для дальнейшей компиляции критического css
css/                                # css стили
    header.min.css                  # css стили критического css, который при сборке на production будет автоматически инлайн способом вставлен в html код с заменой путей используемых шрифтов и графики
    style.min.css                   # Результат конкатенации реализации всех блоков в технологии css
fonts/                              # Шрифты проекта
img/                                # Изображения проекта
    favicon/                        # Фавиконы
    icons/                          # Иконки проекта
        png/                        # Директория иконок для png спрайта
        svg/                        # Директория иконок для svg спрайта
jade/                               # Файлы jade реализации проекта
    templates/                      # Директория шаблонов проекта
        head/                       # Реализация шаблона head
        ...                         # Реализация других шаблонов
    index.jade                      # Страница проекта, будет преобразована в index.html
js/                                 # js файлы проекта
    blocks.min.js                   # Результат конкатенации реализации всех блоков в технологии js
    common.js                       # Отдельные от блоков js решения проекта
    libs.min.js                     # Результат конкатенации js файлов сторонних библиотек
libs/                               # Сторонние библиотеки
    ...                             # Папки с файлами используемых библиотек
    include-libs.js                 # Файл подключения всех js файлов сторонних библиотек 
    include-libs.scss               # Файл подключения всех css файлов сторонних библиотек
scss/                               # scss файлы проекта
    _base.scss                      # Базовые стили проекта
    _fonts.scss                     # Файл подключения шрифтов
    _png-sprite.scss                # Миксины png спрайта
    _reset.scss                     # Сброс стилей
    _vars.scss                      # Переменные
    header.scss                     # Файл подключения стилей критического css
    style.scss                      # Основной файл подключения всех стилей
.htaccess                           # Файл конфигурации веб-сервера
index.html                          # Страница index. Результат преоразования файла jade/index.jade
```