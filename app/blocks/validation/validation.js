'use strict';

$(function() {

  $.validator.addMethod('myEmail', function( value, element ) {
    return this.optional( element ) || /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test( value );
  }, 'Некорректный email');

  $.validator.addMethod('validationRequired', $.validator.methods.required, 'Обязательное поле!');
  $.validator.addMethod('validationMinlength', $.validator.methods.minlength, 'Минимум {0} символов!');
  $.validator.addMethod('validationMaxlength', $.validator.methods.maxlength, 'Максимум {0} символов!');
  $.validator.addMethod('validationDigits', $.validator.methods.digits, 'Должны быть только цифры!');
  $.validator.addMethod('validationRangelength', $.validator.methods.rangelength, 'Символов не менее {0} и не более {1}');

  $.validator.addClassRules({
    validation: {
      validationRequired: true
    },
    validation_email: {
      myEmail: true
    },
    validation_minlength: {
      validationMinlength: 3
    },
    validation_maxlength: {
      validationMaxlength: 10
    },
    validation_digits: {
      validationDigits: true
    },
    validation_rangelength: {
      validationRangelength: [3, 7]
    }
  });

});
