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

  this.modal = $('[data-remodal-id=modal]').remodal();

  d3.json("https://api.github.com/repos/ganezasan/dump/issues?state=all&per_page=100", function(error, json) {
    this.openIssues = json.filter(function(d){ return d.state === 'open' && d.pull_request === undefined; });
    this.closedIssues = json.filter(function(d){ return d.state === 'closed' && d.pull_request === undefined; });
    initTable(this.openIssues,'#SaleItems');
    initTable(this.closedIssues,'#SoldItems');
    initTable(this.cart.items,'#CartItems');
  });

  this.cart = new Cart();

  updateTotal();

  //change tab
  $("#tabs li").on('click',function(e){
    $('#tabs li[class="active"]').removeClass('active');
    $(this).attr('class','active');
    $('.main table').css('display', 'none');
    $('.main[data-type="'+$(this).attr('data-type')+'"] table').css('display','block');
  });

  //parchase
  $("#purchase").on('click',function(){
    openModal('success',"PullRequestを送ってください。",true)
  });
}

function updateTotal(){
  var totalAmountTag = d3.select("#totalAmount")
    .selectAll('a')
    .data([this.cart]);

  totalAmountTag.enter().append('a')
    .text(function(d){return "total: " + d.amount;});

  totalAmountTag.text(function(d){return "total: ¥" + d.amount;});
}

function addCart(item){
  if(this.cart.checkItem(item)){
    openModal('danger',"既にカートに入っています",false);
    return false;
  }

  var amount = item.body.match(/[\d,]?[\d,]+(\r){1}/);

  item.amount = amount.length > 0 ? Number(amount[0].split(",").join("")) : 0;

  this.cart.addItem(item);

  updateTotal();

  initTable(this.cart.items,'#CartItems');

  var modalMessage = item.title + "をカートに追加しました。";

  openModal('success',modalMessage,false);
}

function cancelItem(item){
  item.amount = 1000;
  this.cart.cancelItem(item);

  initTable(this.cart.items,'#CartItems');
}

function initTable(json,tbodyId){
  var tbody = d3.select(tbodyId).select('tbody');

  var tr = tbody.selectAll('tr')
    .data(json);

  td = tr.enter().append('tr').append('td');
  tr.exit().remove();

  td.append("h2")
    .text(function(d) { return "#"+ d.number +" : "+ d.title });

  td.append("text")
    .attr("class", "detail")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .html(function(d) { return marked(d.body) });

  if(tbodyId === '#SaleItems' || tbodyId === '#CartItems'){
    var button = td.append("button")
      .attr('class','btn btn-default')
  }

  if(tbodyId === '#SaleItems'){
    button.text('add')
      .on("click", function(e){ addCart(e); });
  }else if(tbodyId === '#CartItems'){
    button.text('cancel')
      .on("click", function(e){ cancelItem(e); });
  }

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
    var imgs = $(contents).find('img').get();

    $(contents).find('.images').remove();

    var ul = $('<ul>').attr('class','images');
    imgs.forEach(function(img){
      $(img).attr("class",'img-thumbnail');
      ul.append($('<li>').append(img));
    });

    $(contents).children('td').children('h2').after(ul);

  });
  $('.images').viewer();
}

function openModal(alart,message,parchase){

  $('[data-remodal-id=modal] .message').text(message);

  if(alart === "success"){
    $('[data-remodal-id=modal] .title')
      .removeClass('alert-danger')
      .addClass('alert-success')
      .text("Thank You");
  }else{
    $('[data-remodal-id=modal] .title')
      .removeClass('alert-success')
      .addClass('alert-danger')
      .text("Alart");
  }

  if(parchase){
    $('[data-remodal-id=modal] .markdown-body').css("display","block");
  }else{
    $('[data-remodal-id=modal] .markdown-body').css("display","none");
  }

  this.modal.open();
}
