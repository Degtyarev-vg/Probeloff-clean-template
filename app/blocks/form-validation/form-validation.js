'use strict';

$(function() {

  $('.form-validation').each( function() {
    var thisButton = $(this).find('button[type=\'submit\']');

    $(this).validate({
      highlight: function(element, errorClass) {
          $(element)
            .parent()
            .removeClass('form-validation__group_valid')
            .addClass('form-validation__group_invalid');

          $(element)
            .removeClass('validation_valid')
            .addClass('validation_invalid');
      },
      unhighlight: function(element, errorClass) {
          $(element)
            .parent()
            .removeClass('form-validation__group_invalid')
            .addClass('form-validation__group_valid');

          $(element)
            .addClass('validation_valid')
            .removeClass('validation_invalid');
      },
      errorElement: 'span',
      errorClass: 'form-validation__error-text',
      ignore: '.validation_ignore',
      focusInvalid: true,
      /*errorPlacement: function(error, element){
        return true;
      },*/
      submitHandler: function(form) {
        var th = $(form);
        $.ajax({
          type: 'POST',
          url: './mail.php',
          data: th.serialize()
        }).done(function(response) {
          thisButton.attr('disabled', 'disabled');
          $('.answer-form-show').click();
          setTimeout(function() {
            th.trigger('reset');
            thisButton.removeAttr('disabled');
            th.find('.validation_valid').removeClass('validation_valid');
            th.find('.form-validation__group_valid').removeClass('form-validation__group_valid');
          }, 3000);
        });
        return false;
      }
    });

  });

});
