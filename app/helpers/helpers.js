
var requestM = require('request');

const crypto = require("crypto");


module.exports.test = function (length) {
    
    return true;
};
module.exports.randomNumber = function (length) {
    /*var chars = '1234506789';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];*/
    let id = crypto.randomBytes(length).toString("hex");
    return id;
};
module.exports.randomNPV = function () {
   
            //let inputs = req.body ;
            var alphabet = '1234567890';
            var pass = '' //remember to declare $pass as an array
            var alphaLength = (alphabet.length) - 1; //put the length -1 in cache
            for (var i = 0; i < 11; i++) {
                var n = Math.floor((Math.random() * alphaLength) + 1);
                pass += alphabet[n]
            }
            return (pass); //turn the array into a string

        
};
module.exports.arrUnique = function (values) {
     let concatArray = values.map(eachValue => {
        return Object.values(eachValue).join('')
      })
      let filterValues = values.filter((value, index) => {
        return concatArray.indexOf(concatArray[index]) === index

      })
      return filterValues;
};
module.exports.unixTimestamp = function (date = Date.now()) {
  return Math.floor(date / 1000)
}
module.exports.sliceIntoChunks = function (array, parts) {
    /*const res = [];
    console.log("arr==",arr);
    console.log("chunkSize==",chunkSize);
    const middleIndex = Math.ceil(arr.length / chunkSize);
    console.log("middleIndex==",middleIndex);
    chunkSize = middleIndex;
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;*/
    
    let result = [];
    for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
};

module.exports.rawurlencode = function (str) {
    
    var histogram = {}, tmp_arr = [];  
    var ret = str.toString();  
  
    var replacer = function(search, replace, str) {  
        var tmp_arr = [];  
        tmp_arr = str.split(search);  
        return tmp_arr.join(replace);  
    };  
  
    // The histogram is identical to the one in urldecode.  
    histogram["'"]   = '%27';  
    histogram['(']   = '%28';  
    histogram[')']   = '%29';  
    histogram['*']   = '%2A';   
    histogram['~']   = '%7E';  
    histogram['!']   = '%21';  
  
    // Begin with encodeURIComponent, which most resembles PHP's encoding functions  
    ret = encodeURIComponent(ret);  
  
    // Restore spaces, converted by encodeURIComponent which is not rawurlencode compatible  
    ret = replacer('%20', ' ', ret); // Custom replace. No regexing  
  
    for (search in histogram) {  
        replace = histogram[search];  
        ret = replacer(search, replace, ret) // Custom replace. No regexing  
    }  
  
    // Uppercase for full PHP compatibility  
    return ret.replace(/(\%([a-z0-9]{2}))/g, function(full, m1, m2) {  
        return "%"+m2.toUpperCase();  
    });  
  
    return ret; 
};


