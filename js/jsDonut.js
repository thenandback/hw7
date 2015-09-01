
var Master = function(shopList) {
    this.shopList = shopList;
    this.addShop = function(shop) {
        this.shopList.push(shop);
    };
    
    this.generateReport = function() {
        for (var i = 0; i < this.shopList.length; i++) {
            console.log(this.shopList[i].name + " sells " + this.shopList[i].genDPH() + 
                " donuts per hour and " + this.shopList[i].genDPD() + " per day.");
        }
    };
};

// DonutShop takes two "time" parameters between 0 and 24.
var DonutShop = function(name, openTime, closeTime, minClients, maxClients, donuts) {
    hourCheck(openTime, closeTime, minClients, maxClients, donuts);
    this.name = name;
    this.openTime = openTime;
    this.closeTime = closeTime;
    this.minClients = minClients;
    this.maxClients = maxClients;
    this.donuts = donuts;

    this.getHours = function() {
        if (this.openTime > this.closeTime) {
            return this.openTime - this.closeTime;
        } else {
            return this.closeTime - this.openTime;
        }
    };

    this.genDPH = function() {
        return Math.ceil(Math.floor(this.minClients + (Math.random() * 
            (this.maxClients - this.minClients))) * this.donuts);
    };

    this.genDPD = function() {
        var donutTotal = 0;
        for (var i = 0; i < this.getHours(); i++) {
           donutTotal += this.genDPH();
        }
        
        return donutTotal;
    };

    this.printHours = function() {
        for (var i = 1; i <= this.getHours(); i++) {
            console.log("Hour " + i + " = " + this.genDPH());
        }
    };
};

// makes a new donut shop. Takes a name and semi-randomly generates stats, then places in "chain".
var makeStore = function(name, manager) {
    var open = Math.ceil(Math.random() * 24);
    var close = Math.ceil(Math.random() * 24);
    var minClients = 1;
    var maxClients = Math.ceil(Math.random() * 49) + 1;
    var donuts = Math.ceil(Math.random() * 7);
    var newStore = new DonutShop(name, open, close, minClients, maxClients, donuts);
    manager.addShop(newStore);
    return newStore;
};

var hourCheck = function(openTime, closeTime, minClients, maxClients, donuts) {
    if (0 < openTime > 24 || 0 < closeTime > 24 || openTime == closeTime ||
        minClients < 0 || maxClients < 0 || minClients > maxClients || donuts < 0) {
        console.log("VALID HOURS NOT INPUTTED.");
    }
};

var downtown = new DonutShop("Downtown", 19, 22, 8, 43, 4.5);
var capitolHill = new DonutShop("Capitol Hill", 24, 11, 4, 37, 2);
var southLakeUnion = new DonutShop("South Lake Union", 12, 20, 9, 23, 6.33);
var wedgewood = new DonutShop("Wedgewood", 7, 16, 2, 28, 1.25);
var ballard = new DonutShop("Ballard", 16, 14, 8, 58, 3.75);

var chain = new Master([downtown, capitolHill, southLakeUnion, wedgewood, ballard]);

// Adds a store into HTML table
var addRow = function(shop) {
    var rmIcon = '<img src="http://i.imgur.com/PDPRFnx.png" class="trash" />';
    var row = '<tr class="shopRow"><td>' + shop.name + '</td><td>' + shop.genDPH() + '</td><td>' +
        shop.genDPD()  + '</td><td>' + rmIcon + '</td></tr>';
    $('tbody#table').append(row);
};

$(function() {
    var list = chain.shopList;
    for (var i = 0; i < list.length; i++) {
        addRow(list[i]);
    }
});

// Removes row from HTML table
$(function() {
    $('tbody').on('click', 'img', function() {
        var $row = $(this.parentNode.parentNode);
        $row.animate({
            opacity:0.0
        }, 1200, function() {
            $row.remove();
        });
    });
});

// Form that accepts name to create & add new donut shop
$(function() {
    var $newItemButton = $('#newItemButton');
    var $newItemForm = $('form');
    var $textInput = $('input:text');

    $newItemButton.show();
    $newItemForm.hide();

    $('button').on('click', function() {
        $newItemButton.hide();
        $newItemForm.show();
    });

    $newItemForm.on('submit', function(e) {
        e.preventDefault();        
        var newText = $('input:text').val();
        var newStore = makeStore(newText, chain);
        addRow(newStore);
        $textInput.val('');
    });
});



