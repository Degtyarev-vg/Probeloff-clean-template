'use strict';

// Генератор файлов блока

// Использование: node createBlock.js [имя блока] [доп. расширения через пробел]

const fs = require('fs');                // будем работать с файловой системой
const pjson = require('./package.json'); // получим настройки из package.json
const dirs = pjson.config.directories;   // отдельно имеем объект с директориями (где лежаи папка с блоками)
const mkdirp = require('mkdirp');        // зависимость

var mainFile = 'style.scss';             // файл подключения

let blockName = process.argv[2];          // получим имя блока
let defaultExtensions = ['jade', 'scss']; // расширения по умолчанию
let extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(3)));  // добавим введенные при вызове расширения (если есть)

// Если есть имя блока
if(blockName) {

  let dirPath = dirs.source + '/blocks/' + blockName + '/'; // полный путь к создаваемой папке блока
  mkdirp(dirPath, function(err){                            // создаем

    // Если какая-то ошибка — покажем
    if(err) {
      console.error('[NTH] Отмена операции: ' + err);
    }

    // Нет ошибки, поехали!
    else {
      console.log('[NTH] Создание папки ' + dirPath + ' (создана, если ещё не существует)');

      // Читаем файл подключения
      let connectManager = fs.readFileSync(dirs.source + '/scss/' + mainFile, 'utf8');

      // Делаем из строк массив, фильтруем массив, оставляя только строки с незакомментированными импортами
      let fileSystem = connectManager.split('\n').filter(function(item) {
        if(/^(\s*)@import/.test(item)) return true;
        else return false;
      });

      // Обходим массив расширений и создаем файлы, если они еще не созданы
      extensions.forEach(function(extention){

        let filePath = dirPath + blockName + '.' + extention; // полный путь к создаваемому файлу
        let fileContent = '';                                 // будущий контент файла
        let SASSfileImport = '';                              // конструкция импорта будущего SCSS
        let fileCreateMsg = '';                               // будущее сообщение в консоли при создании файла

        // Если это SCSS
        if(extention == 'scss') {
          SASSfileImport = '@import \'' + dirs.source + '/blocks/' + blockName + '/' + blockName + '.scss\';';
          fileContent = '// Для импорта в файл подключения: ' + SASSfileImport + '\n\n@import \'../../scss/vars.scss\';     // файл с переменными\n@import \'../../scss/png-sprite\';    // файл с png-спрайтами\n@import \'bourbon\';\n\n\n.' + blockName + ' {\n  \n}\n';
          fileCreateMsg = '[NTH] Для импорта стилей: ' + SASSfileImport;

          // Создаем регулярку с импортом
          let reg = new RegExp(SASSfileImport, '');

          // Создадим флаг отсутствия блока среди импортов
          let impotrtExist = false;

          // Обойдём массив и проверим наличие импорта
          for (var i = 0, j=fileSystem.length; i < j; i++) {
            if(reg.test(fileSystem[i])) {
              impotrtExist = true;
              break;
            }
          }

          // Если флаг наличия импорта по-прежнему опущен, допишем импорт
          if(!impotrtExist) {
            // Открываем файл
            fs.open(dirs.source + '/scss/' + mainFile, 'a', function(err, fileHandle) {
              // Если ошибок открытия нет...
              if (!err) {
                // Запишем в конец файла
                fs.write(fileHandle, SASSfileImport + '\n', null, 'utf8', function(err, written) {
                  if (!err) {
                    console.log('[NTH] В файл подключений ('+ dirs.source + '/scss/' + mainFile + ') записано: ' + SASSfileImport);
                  } else {
                    console.log('[NTH] ОШИБКА записи в '+ dirs.source + '/scss/' + mainFile + ': ' + err);
                  }
                });
              } else {
                console.log('[NTH] ОШИБКА открытия '+ dirs.source + '/scss/' + mainFile + ': ' + err);
              }
            });
          }
          else {
            console.log('[NTH] Импорт НЕ прописан в '+ dirs.source + '/scss/' + mainFile + ' (он там уже есть)');
          }
        }

        // Если это jade
        else if(extention == 'jade') {
          fileContent = 'mixin ' + blockName + '()\n\t+b.' + blockName + '&attributes(attributes)\n\t\tblock\n';
          fileCreateMsg = '[NTH] Для вставки разметки: @@include(\'blocks/' + blockName + '/' + blockName + '.jade\')  Подробнее: https://www.npmjs.com/package/gulp-file-include';
        }

        // Если это JS
        else if(extention == 'js') {
          fileContent = '$(document).ready(function() {\n// код\n});';
        }

        // Создаем файл, если он еще не существует
        if(fileExist(filePath) === false) {
          fs.writeFile(filePath, fileContent, function(err) {
            if(err) {
              return console.log('[NTH] Файл НЕ создан: ' + err);
            }
            console.log('[NTH] Файл создан: ' + filePath);
            if(fileCreateMsg) {
              console.warn(fileCreateMsg);
            }
          });
        }
        else {
          console.log('[NTH] Файл НЕ создан: ' + filePath + ' (уже существует)');
        }
      });
    }
  });
}
else {
  console.log('[NTH] Отмена операции: не указан блок');
}

// Оставить в массиве только уникальные значения (убрать повторы)
function uniqueArray(arr) {
  var objectTemp = {};
  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    objectTemp[str] = true; // запомнить строку в виде свойства объекта
  }
  return Object.keys(objectTemp);
}

// Проверка существования файла
function fileExist(path) {
  const fs = require('fs');
  try {
    fs.statSync(path);
  } catch(err) {
    return !(err && err.code === 'ENOENT');
  }
}