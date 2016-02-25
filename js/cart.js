var Cart = function() {
  this.items = [];
  this.amount = 0;

  this.addItem = function(item){
    this.items.push(item);
    this.amount += item.amount;
  };

  this.cancelItem = function(item){
    this.items = this.items.filter(function(d){ return d.number !== item.number; });
    this.amount -= item.amount;
  };

  this.checkItem = function(item){
    return (this.items.filter(function(d){ return d.number === item.number; }).length > 0);
  };
};
