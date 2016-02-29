init();

function init(){
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });

  d3.json("https://api.github.com/repos/ganezasan/dump/issues?state=all&per_page=100", function(error, json) {
    this.openIssues = json.filter(function(d){ return d.state === 'open' && d.pull_request === undefined; });
    this.closedIssues = json.filter(function(d){ return d.state === 'closed' && d.pull_request === undefined; });
    initTable(this.openIssues,'#SaleItems');
    initTable(this.closedIssues,'#SoldItems');
  });

  //change tab
  $("#tabs li").on('click',function(e){
    $('#tabs li[class="active"]').removeClass('active');
    $(this).attr('class','active');
    $('.main table').css('display', 'none');
    $('.main[data-type="'+$(this).attr('data-type')+'"] table').css('display','block');
  });

}

function initTable(json,tbodyId){
  var tbody = d3.select(tbodyId).select('tbody');

  var tr = tbody.selectAll('tr')
    .data(json);

  td = tr.enter().append('tr').append('td');
  tr.exit().remove();

  td.append("h2")
    .append("a")
    .attr("xlink:href", function(d) {return d.html_url;})
    .attr("xlink:target","_blank")
    .html(function(d) { return "#"+ d.number +" : "+ d.title; })
    .on("click",function(e){
      window.open().location.href = e.html_url;
    });

  td.append("text")
    .attr("class", "detail")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .html(function(d) { return marked(d.body); });

  setImageViewer(tbodyId);
}

function setImageViewer(tbodyId){
  var options = {
    inline: true,
    title: false,
    tooltip: false,
    movable: false,
    zoomable: false,
    rotatable: false,
    scalable: false,
    fullscreen: false,
    toolbar: false,
  };

  $(tbodyId + ' tr').each(function(i,contents){
    var imgs = $(contents).find(".detail").find('img').get();

    if(imgs.length !== 0){

      $(contents).find('.images').remove();

      var ul = $('<ul>').attr('class','images');

      imgs.forEach(function(img){
        $(img).attr("class",'img-thumbnail');
        ul.append($('<li>').append(img));
      });

      $(contents).children('td').children('h2').after(ul);
    }
  });
  $('.images').viewer();
}
