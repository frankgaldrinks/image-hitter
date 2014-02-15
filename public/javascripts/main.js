$(document).ready(function() {
  var socket = io.connect('http://localhost');

  var $displayTemplate = $("#displayTemplate").html();
  var $shitbox = $("#shitbox");

  $(this).on('click', '.remove-me', function(){

    var $id = $(this).parent().data('id');
    var $ipblock = $(this).parent();
    $.ajax({
        type: "POST",
        url: "/delete",
        dataType: "json",
        data: {id: $id, _method: "delete"},

        success: function(json) {
          console.log("deleted " + $id);
          $ipblock.remove();
        },
        error: function(xhr, status) {
          console.log("failed deleting " + $id);
        }
      });
  });

  socket.on("shitbox", function (data) {
    // $("#shitbox").append("<p>" + data.message + "</p>");
    var template = Mustache.render($displayTemplate, data);
    $shitbox.prepend(template);
  });
});


