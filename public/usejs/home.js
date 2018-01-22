/**
 * Created by harsh on 27-06-2017.
 */
function logout() {
    $.ajax({
        url:'users/logout',
        type:'post',
        data:{
            log :"logout"
        },
        success:function (data) {
            window.location = "/"


        }
    })
}
function pie() {
    var js = [
        { "count": parseInt($('.todos').html())-parseInt($('.prowork').html())- parseInt($('.completework').html()),"color":"#ff6358","label":"To Do" },
        { "count":  parseInt($('.prowork').html()) ,"color":"#70b4d5","label":"In Progress"},
        { "count":  parseInt($('.completework').html()),"color":"#5dc366","label":"Completed" }

    ];
console.log(js)




    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeCategory20b);
    var svg = d3.select('#pie_chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    var pie = d3.pie()
        .value(function(d) { return d.count; })
        .sort(null);
    var path = svg.selectAll('path')
        .data(pie(js))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
            return js[i].color;
        });
}
allowDrop = function (ev) { ev.preventDefault();}
drag = function (ev) {

    console.log($('#'+ev.target.id).parents("div").attr("id"))
    ev.dataTransfer.setData("to",$('#'+ev.target.id).parents("div").attr("id")); ev.dataTransfer.setData("te", ev.target.id); };
drop = function(ev) {



    ev.preventDefault();



var data = ev.dataTransfer.getData("te");console.log(ev.target) ;
var id = ev.dataTransfer.getData("to")
console.log(data)
dat = JSON.parse($('#'+data).attr("data"))
    $('.'+id).html(parseInt($('.'+id).html()) - 1)
    console.log(dat)
$.ajax({
    url:'home/updatework',
    type:"post",
    data:{
    id:dat.id,
    update:ev.target.id
    }

})

    $('.'+ev.target.id).html(parseInt($('.'+ev.target.id).html())+ 1)
ev.target.appendChild(document.getElementById(data));
$('#pie_chart').empty();
pie()



}
$(document).ready(function () {

if($('.moveup'))
{
    setTimeout(function () {
        $('.moveup').remove()
    },5000)
}
    $('.ui.dropdown')
        .dropdown()
    ;
    $('#example1').calendar();
    $('#example2').calendar();
    $('#addmem').click(function () {



        $('.addp')
            .modal({"transition":"vertical flip"})
            .modal('show')
        ;

    })
$('.imageview').click(function () {
    str = '<div class="header" style="color: #f2711c;text-align: center">' + $(this).attr("data-name") +'</div>'


    str = str  + '<div class="content">' + '<div class="ui tiny images" style="text-align: center">' + '<img class="ui  circular image imageview" src="'+$(this).attr("src")+'">' + '</div>'
   str = str + '<h4 style="color: #f2711c;text-align: center" class="ui center aligned header" >'+$(this).attr("data-designation")+'</h4>' + '</div>';
    $('.viewp').empty()
    $('.viewp').append(str);



    $('.viewp')
        .modal({"transition":"vertical flip"})
        .modal('show')

})

$('#titlesub').click(function (e) {
    e.preventDefault()
    if($('#title').val().length>0 && $('#peopletext .namerep').html().length>0  && $('#skillselect').val().length>0 && $('#startdate').val().length>0 && $('#enddate').val().length>0) {
    var startdate = new Date($('#startdate').val())
        var enddate = new Date($('#enddate').val())
        var title = $('#title').val()
        var peoplename =  $('#peopletext .namerep').html()
        var peopleimg =  $('#peopletext .image').attr('src')
        var skills = $('#skillselect').val();
    console.log(peopleimg)

$.ajax({
    url:'home/peoplework',
    type:'post',
    data:{
        title:title,
       skill:skills,
        peopleimg:peopleimg,
        peoplename:peoplename,
        startdate :startdate,
        enddate:enddate,
        progress:"todo"
    },
    success:function (data) {
        if(data == '/home')
        {
            window.location = '/home'
        }
        else
        {
            $('.errorse').css({
                'display':'block'
            })
            setTimeout(function () {
                $('.errorse').css({
                    'display':'none'
                })
            },5000)
        }


    }
})

    }
    else
    {
        $('.errorse').css({
            'display':'block'
        })
        setTimeout(function () {
            $('.errorse').css({
                'display':'none'
            })
        },5000)

    }
})

pie()
})
