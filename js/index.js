var Cart = function() {
  this.items = [];
  this.amount = 0;

  this.addItem = function(item){
    this.items.push(item);
    this.amount += item.amount;
  };
};

init();

function init(){
  d3.json("https://api.github.com/repos/ganezasan/dump/issues", function(error, json) {
    initTable(json);
  });
  this.cart = new Cart();
}

function addCart(item){
  item.amount = 1000;
  this.cart.addItem(item);
  console.log(this.cart);
}

function initTable(json){
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

  var tbody = d3.select('#Items')
    .append('tbody');

  var tr = tbody.selectAll('tr')
    .data(json)
    .enter().append('tr');

  var td = tr.append("td");

  td.append("h2")
    .append("a")
    .text(function(d) { return "#"+ d.number +" : "+ d.title });

  td.append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .html(function(d) { return marked(d.body) });

  td.append("button")
    .attr('class','btn btn-default')
    .text('add')
    .on("click", function(e){ addCart(e); });

  setImageViewer();
}

function setImageViewer(){
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

  $('tr').each(function(i,contents){
    var imgs = $(contents).find('img').get();

    var ul = $('<ul>').attr('class','images');
    imgs.forEach(function(img){
      $(img).attr("class",'img-thumbnail');
      ul.append($('<li>').append(img));
    });
    $(contents).children('td').children('h2').after(ul);
  });
  $('.images').viewer();
}
