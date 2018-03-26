'use strict';

// Генератор файлов блока

// Использование: node createBlock.js [имя блока] [доп. расширения через пробел]

const fs = require('fs');                // будем работать с файловой системой
const pjson = require('./package.json'); // получим настройки из package.json
const dirs = pjson.config.directories;   // отдельно имеем объект с директориями (где лежит папка с блоками)
const mkdirp = require('mkdirp');        // зависимость

let mainFile = process.argv[2];          // файл подключения
var writeBlock = 'blocks.project';       // директория для записи

let blockName = process.argv[3];          // получим имя блока
let defaultExtensions = ['scss'];         // расширения по умолчанию
let extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(4)));  // добавим введенные при вызове расширения (если есть)

// Если есть имя блока
if(blockName) {

  let dirPath = dirs.source + '/'+ writeBlock +'/' + blockName + '/'; // полный путь к создаваемой папке блока
  mkdirp(dirPath, function(err){                            // создаем

    // Если какая-то ошибка — покажем
    if(err) {
      console.error('Отмена операции: ' + err);
    }

    // Нет ошибки, поехали!
    else {
      console.log('Создание папки ' + dirPath + ' (создана, т.к. еще не существовала)');

      // Читаем файл подключения
      let connectManager = fs.readFileSync(dirs.source + '/'+ writeBlock +'/' + mainFile, 'utf8');
      let connectManagerpug = fs.readFileSync(dirs.source + '/'+ writeBlock +'/' + 'includes.pug', 'utf8');
      let connectManagerJS = fs.readFileSync(dirs.source + '/'+ writeBlock +'/' + 'includes.js', 'utf8');

      // Делаем из строк массив, фильтруем массив, оставляя только строки с незакомментированными импортами
      let fileSystem = connectManager.split('\n').filter(function(item) {
        if(/^(\s*)@import/.test(item)) return true;
        else return false;
      });

      // Делаем из строк массив, фильтруем массив, оставляя только строки с незакомментированными импортами
      let fileSystemPUG = connectManagerpug.split('\n').filter(function(item) {
        if(/^(\s*)include/.test(item)) return true;
        else return false;
      });

      // Делаем из строк массив, фильтруем массив, оставляя только строки с незакомментированными импортами
      let fileSystemJS = connectManagerJS.split('\n').filter(function(item) {
        if(/^(\s*)\/\/= include/.test(item)) return true;
        else return false;
      });

      // Обходим массив расширений и создаем файлы, если они еще не созданы
      extensions.forEach(function(extention){

        let filePath = dirPath + blockName + '.' + extention; // полный путь к создаваемому файлу
        let fileContent = '';                                 // будущий контент файла
        let SASSfileImport = '';                              // конструкция импорта будущего SCSS
        let PUGfileImport = '';                              // конструкция импорта будущего pug
        let JSfileImport = '';                                // конструкция импорта будущего JS
        let fileCreateMsg = '';                               // будущее сообщение в консоли при создании файла

        // Если это SCSS
        if(extention == 'scss') {
          SASSfileImport = '@import \'' + dirs.source + '/'+ writeBlock +'/' + blockName + '/' + blockName + '\';';
          fileContent = '// Для импорта в файл подключения: ' + SASSfileImport + '\n\n@import \'../../scss/vars\';     // файл с переменными\n@import \'../../scss/png-sprite\';    // файл с png-спрайтами\n\n\n.' + blockName + ' {\n  \n}\n';
          fileCreateMsg = 'Для импорта стилей: ' + SASSfileImport;

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
            fs.open(dirs.source + '/'+ writeBlock +'/' + mainFile, 'a', function(err, fileHandle) {
              // Если ошибок открытия нет...
              if (!err) {
                // Запишем в конец файла
                fs.write(fileHandle, SASSfileImport + '\n', null, 'utf8', function(err, written) {
                  if (!err) {
                    console.log('В файл подключений ('+ dirs.source + '/'+ writeBlock +'/' + mainFile + ') записано: ' + SASSfileImport);
                  } else {
                    console.log('ОШИБКА записи в '+ dirs.source + '/'+ writeBlock +'/' + mainFile + ': ' + err);
                  }
                });
              } else {
                console.log('ОШИБКА открытия '+ dirs.source + '/'+ writeBlock +'/' + mainFile + ': ' + err);
              }
            });
          }
          else {
            console.log('Импорт НЕ прописан в '+ dirs.source + '/'+ writeBlock +'/' + mainFile + ' (он там уже есть)');
          }
        }

        // Если это pug
        else if(extention == 'pug') {
          PUGfileImport = 'include ' + blockName + '/' + blockName;
          fileContent = 'mixin ' + blockName + '()\n  +b.' + blockName + '&attributes(attributes)\n    block\n';
          fileCreateMsg = 'Для вставки разметки: @@include(\''+ writeBlock +'/' + blockName + '/' + blockName + '.pug\')  Подробнее: https://www.npmjs.com/package/gulp-file-include';

          // Создаем регулярку с импортом
          let reg = new RegExp(PUGfileImport, '');

          // Создадим флаг отсутствия блока среди импортов
          let impotrtExist = false;

          // Обойдём массив и проверим наличие импорта
          for (var i = 0, j=fileSystemPUG.length; i < j; i++) {
            if(reg.test(fileSystemPUG[i])) {
              impotrtExist = true;
              break;
            }
          }

          // Если флаг наличия импорта по-прежнему опущен, допишем импорт
          if(!impotrtExist) {
            // Открываем файл
            fs.open(dirs.source + '/'+ writeBlock +'/' + 'includes.pug', 'a', function(err, fileHandle) {
              // Если ошибок открытия нет...
              if (!err) {
                // Запишем в конец файла
                fs.write(fileHandle, PUGfileImport + '\n', null, 'utf8', function(err, written) {
                  if (!err) {
                    console.log('В файл подключений ('+ dirs.source + '/'+ writeBlock +'/' + 'includes.pug' + ') записано: ' + PUGfileImport);
                  } else {
                    console.log('ОШИБКА записи в '+ dirs.source + '/'+ writeBlock +'/' + 'includes.pug' + ': ' + err);
                  }
                });
              } else {
                console.log('ОШИБКА открытия '+ dirs.source + '/'+ writeBlock +'/' + 'includes.pug' + ': ' + err);
              }
            });
          }
          else {
            console.log('Импорт НЕ прописан в '+ dirs.source + '/'+ writeBlock +'/' + 'includes.pug' + ' (он там уже есть)');
          }

        }

        // Если это JS
        else if(extention == 'js') {
          JSfileImport = '//= include ' + blockName + '/' + blockName + '.js';
          fileContent = '\'use strict\';\n\n$(function() {\n\n  \n\n});';

          // Создаем регулярку с импортом
          let reg = new RegExp(JSfileImport, '');

          // Создадим флаг отсутствия блока среди импортов
          let impotrtExist = false;

          // Обойдём массив и проверим наличие импорта
          for (var i = 0, j=fileSystemJS.length; i < j; i++) {
            if(reg.test(fileSystemJS[i])) {
              impotrtExist = true;
              break;
            }
          }

          // Если флаг наличия импорта по-прежнему опущен, допишем импорт
          if(!impotrtExist) {
            // Открываем файл
            fs.open(dirs.source + '/'+ writeBlock +'/' + 'includes.js', 'a', function(err, fileHandle) {
              // Если ошибок открытия нет...
              if (!err) {
                // Запишем в конец файла
                fs.write(fileHandle, JSfileImport + '\n', null, 'utf8', function(err, written) {
                  if (!err) {
                    console.log('В файл подключений ('+ dirs.source + '/'+ writeBlock +'/' + 'includes.js' + ') записано: ' + JSfileImport);
                  } else {
                    console.log('ОШИБКА записи в '+ dirs.source + '/'+ writeBlock +'/' + 'includes.js' + ': ' + err);
                  }
                });
              } else {
                console.log('ОШИБКА открытия '+ dirs.source + '/'+ writeBlock +'/' + 'includes.js' + ': ' + err);
              }
            });
          }
          else {
            console.log('Импорт НЕ прописан в '+ dirs.source + '/'+ writeBlock +'/' + 'includes.js' + ' (он там уже есть)');
          }

        }

        // Если это json
        else if(extention == 'json') {
          fileContent = '{\n  \n}';
        }

        // Создаем файл, если он еще не существует
        if(fileExist(filePath) === false) {
          fs.writeFile(filePath, fileContent, function(err) {
            if(err) {
              return console.log('Файл НЕ создан: ' + err);
            }
            console.log('Файл создан: ' + filePath);
            if(fileCreateMsg) {
              console.warn(fileCreateMsg);
            }
          });
        }
        else {
          console.log('Файл НЕ создан: ' + filePath + ' (т.к. уже существует)');
        }
      });
    }
  });
}
else {
  console.log('Отмена операции: не указан блок');
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
