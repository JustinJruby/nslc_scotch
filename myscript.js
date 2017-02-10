var config = {
    apiKey: API_KEY,
    authDomain: FIREBASE_AUTH,
    databaseURL: DATABASE_URL,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGE_ID
};


jQuery.ajax({
    url: "https://www.gstatic.com/firebasejs/3.6.7/firebase.js",
    dataType: "script",
    success: function() {
        console.log("tes");
    }
});

firebase.initializeApp(config);
var database = firebase.database();

function parseWhiskey(whiskey_div) {
    var info = {}
    info["name"] = $(".title", whiskey_div).text().trim()
    var details = $(".country", whiskey_div).text().trim().split("|")
    info["price"] = details[1].trim()
    info["country"] = details[0].trim()
    info["url"] = $(".title a", whiskey_div)[0].href
    info["scotchId"] = $(".title a", whiskey_div)[0].href.split("/").pop()
    return info;
}


function writeUserData(whiskey_info) {
    scotchId = whiskey_info["scotchId"]
    name = whiskey_info["name"]
    price = whiskey_info["price"]
    country = whiskey_info["country"]
    url = whiskey_info["url"]
    firebase.database().ref('scotch/' + scotchId).set({
        name: name,
        price: price,
        country: country,
        url: url
    });
}

all_whiskey_divs = $(".views-row")
$.each(all_whiskey_divs, function(index, item) {
    var whiskey_info = parseWhiskey(item);
    writeUserData(whiskey_info)
})

d = firebase.database().ref('scotch/').orderByChild('price');
R;
d.on("value", function(snapshot) {
    R = snapshot.val();
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

scotch_array = []
for (var id in R) {
    R[id].scotchId = id
    scotch_array.push(R[id]);
}
var sort_by_price = function(a, b) {
    a_price = Number.parseFloat(a.price.substring(1))
    b_price = Number.parseFloat(b.price.substring(1))

    if (a_price < b_price) {
        return -1;
    }
    if (a_price > b_price) {
        return 1;
    }

    // names must be equal
    return 0;
};
var sort_by_name = function(a, b) {
    a_name = a.name.toLowerCase().replace("the", "").replace(" ", "")
    b_name = b.name.toLowerCase().replace("the", "").replace(" ", "")
    if (a_name < b_name) {
        return -1;
    }
    if (a_name > b_name) {
        return 1;
    }

    // names must be equal
    return 0;
};

scotch_array.sort(sort_by_name);