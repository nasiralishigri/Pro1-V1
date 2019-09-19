$('#sidebar-collapse').click(function(){
    $(this).find('i').toggleClass('fa-dedent fa-indent')
});
$('#sidebar-minify').click(function(){
    $(this).find('div').toggleClass('sidebar sidebar-mimified')
});

$("#left-sidebar").on('click', '#sidebar-minify', function () {
    $("#left-sidebar").attr("id", "left-sidebar-minifyed");    
});
$("#left-sidebar-minify").on('click', '#sidebar-minify', function () {
    $("#btn2").attr("id", "left-sidebar-open");    
});