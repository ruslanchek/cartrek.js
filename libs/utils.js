var fs = require('fs'),
    numeral = require('numeral'),
    exec = require('child_process').exec,
    crypto = require('crypto');

numeral.language('ru', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'тыс.',
        million: 'млн.',
        billion: 'млрд.',
        trillion: 'трлд.'
    },
    currency: {
        symbol: 'руб.'
    }
});

numeral.language('ru');


/**
 * Humanize price
 * */
this.priceFormat = function (num) {
    return numeral(num).format('0,0.00');
};


/**
 * Date to humanized string
 * */
this.humanizeDate = function (date, output_with_time) {
    if (!date) {
        return '&mdash;';
    }

    if (!(Object.prototype.toString.call(date) === "[object Date]")) {
        var t = date.split('.');

        date = new Date((t[1] + '-' + t[0] + '-' + t[2]));
    }

    var h_date,
        month_names = [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
        ];

    var d = date.getDate(),
        M = date.getMonth(),
        Y = date.getFullYear();

    h_date = d + ' ' + month_names[M] + ' ' + Y;

    if (output_with_time === true) {
        var H = date.getHours(),
            i = date.getMinutes(),
            s = date.getSeconds();

        if (i < 10) {
            i = '0' + i;
        }

        if (s < 10) {
            s = '0' + s;
        }

        h_date = h_date + ', ' + H + ':' + i + ':' + s;
    }

    return h_date;
};


/**
 * Merge two or more objects
 * */
this.extend = function (target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });

    return target;
};

/**
 * Translit str
 * */
this.translitStr = function (str){
    var tr = [
        ['А', 'a'],
        ['Б', 'b'],
        ['В', 'v'],
        ['Г', 'g'],
        ['Д', 'd'],
        ['Е', 'e'],
        ['Ё', 'e'],
        ['Ж', 'j'],
        ['З', 'z'],
        ['И', 'i'],
        ['Й', 'y'],
        ['К', 'k'],
        ['Л', 'l'],
        ['М', 'm'],
        ['Н', 'n'],
        ['О', 'o'],
        ['П', 'p'],
        ['Р', 'r'],
        ['С', 's'],
        ['Т', 't'],
        ['У', 'u'],
        ['Ф', 'f'],
        ['Х', 'h'],
        ['Ц', 'ts'],
        ['Ч', 'ch'],
        ['Ш', 'sh'],
        ['Щ', 'sch'],
        ['Ъ', ''],
        ['Ы', 'yi'],
        ['Ь', ''],
        ['Э', 'e'],
        ['Ю', 'yu'],
        ['Я', 'ya'],
        ['а', 'a'],
        ['б', 'b'],
        ['в', 'v'],
        ['г', 'g'],
        ['д', 'd'],
        ['е', 'e'],
        ['ё', 'e'],
        ['ж', 'j'],
        ['з', 'z'],
        ['и', 'i'],
        ['й', 'y'],
        ['к', 'k'],
        ['л', 'l'],
        ['м', 'm'],
        ['н', 'n'],
        ['о', 'o'],
        ['п', 'p'],
        ['р', 'r'],
        ['с', 's'],
        ['т', 't'],
        ['у', 'u'],
        ['ф', 'f'],
        ['х', 'h'],
        ['ц', 'ts'],
        ['ч', 'ch'],
        ['ш', 'sh'],
        ['щ', 'sch'],
        ['ъ', 'y'],
        ['ы', 'yi'],
        ['ь', ''],
        ['э', 'e'],
        ['ю', 'yu'],
        ['я', 'ya']
    ];

    for(var i = 0, l = tr.length; i < l; i++){
        var reg = new RegExp(tr[i][0], "g");

        str = str.replace(reg, tr[i][1]);
    }

    return str;
};


/**
 * Sanity from symbols
 * */
this.sanityStr = function (str){
    var reg = new RegExp('/[^a-zA-Z0-9-\?]/', "g");
    str = str.replace(reg, "-", str);

    var reg = new RegExp(' ', "g");
    str = str.replace(reg, "-", str);

    var reg = new RegExp('__', "g");
    str = str.replace(reg, "-", str);

    var reg = new RegExp('\\?', "g");
    str = str.replace(reg, "", str);

    str = str.toLowerCase();

    return this.translitStr(str);
};


/**
 * Find in object of array
 * */
this.findInObjOfArray = function(arr, key, val){
    if(arr && arr.length > 0 && key && val){
        for(var i = 0, l = arr.length; i < l; i++){
            if(arr[i][key] == val){
                return arr[i];
            }
        }
    }

    return false;
};


/**
 * Make Date object from pattern dd-mm-yyyy
 */
this.parseDate = function(str){
    var date = new Date();

    date.setDate(str.substr(0, 2));
    date.setMonth(parseInt(str.substr(3, 2)) - 1);
    date.setYear(str.substr(6, 4));
    date.setSeconds(0);
    date.setHours(0);
    date.setMinutes(0);

    return date;
};

/**
 * Make pattern dd.mm.yyyy from Date object
 */
this.stringifyDate = function(date){
    var m = parseInt(date.getMonth()) + 1,
        d = parseInt(date.getDate());

    if(m < 10){
        m = '0' + m.toString();
    }

    if(d < 10){
        d = '0' + d.toString();
    }

    return d + '.' + m + '.' + date.getFullYear();
};


/**
 * Test for regex pattern
 * */
this.matchPatternStr = function(str, type){
    var pattern = null;

    switch (type){
        case 'email' : {
            var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        } break;

        case 'username' : {
            var pattern = /^[a-zA-Z0-9-]{3,64}$/;
        } break;

        case 'name' : {
            var pattern = /^[a-zA-Z0-9А-Яа-я-\s]{3,64}$/;
        } break;

        case 'name_min' : {
            var pattern = /^[a-zA-Z0-9А-Яа-я-]{1,64}$/;
        } break;

        case 'password' : {
            var pattern = /^[a-zA-Z0-9-]{3,32}$/;
        } break;

        case 'md5' : {
            var pattern = /^[a-zA-Z0-9]{32}$/;
        } break;

        case 'hash' : {
            var pattern = /^[a-zA-Z0-9]{64}$/;
        } break;

        case 'float' : {
            var pattern = /^-?\d*(\.\d+)?$/;
        } break;

        case 'date' : {
            var pattern = /^((((0[1-9]|[12][0-8])\.(0[1-9]|1[012]))|((29|30|31)\.(0[13578]|1[02]))|((29|30)\.(0[4,6,9]|11)))\.(19|[2-9][0-9])\d\d$)|(^29-02-(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96))$/;
        }
    }

    if(pattern){
        return pattern.test(str);
    }
};


/**
 * Get Company type by id
 * */
this.getCompanyTypeName = function(id){
    switch (parseInt(id)) {
        case 1 : { return 'ООО' } break;
        case 2 : { return 'ЗАО' } break;
        case 3 : { return 'ОАО' } break;
        case 4 : { return 'ИП' } break;
        case 5 : { return 'ГУП' } break;
        case 6 : { return 'МУП' } break;
        case 7 : { return 'НП' } break;
        case 8 : { return 'АНО' } break;
        default : { return 'Другое' } break;
    }
};


/**
 * Get Company type by id
 * */
this.getCEOType = function(id){
    switch (parseInt(id)) {
        case 1 : { return 'Директор' } break;
        case 2 : { return 'Генеральный директор' } break;
        case 3 : { return 'Председатель' } break;
        case 4 : { return 'Другое' } break;
        case 5 : { return 'Не подписывает' } break;
    }
};


/**
 * Get Accountant type by id
 * */
this.getAccountantType = function(id){
    switch (parseInt(id)) {
        case 1 : { return 'Главный бухгалтер' } break;
        case 2 : { return 'Бухгалтер' } break;
        case 3 : { return 'Другое' } break;
        case 4 : { return 'Не подписывает' } break;
    }
};


/**
 * Price to words
 * */
this.priceToWords = function(float){
    float = parseFloat(float);

    var mapNumbers = {
        0 : [2, 1, "ноль"],
        1 : [0, 2, "один", "одна"],
        2 : [1, 2, "два", "две"],
        3 : [1, 1, "три"],
        4 : [1, 1, "четыре"],
        5 : [2, 1, "пять"],
        6 : [2, 1, "шесть"],
        7 : [2, 1, "семь"],
        8 : [2, 1, "восемь"],
        9 : [2, 1, "девять"],
        10 : [2, 1, "десять"],
        11 : [2, 1, "одиннадцать"],
        12 : [2, 1, "двенадцать"],
        13 : [2, 1, "тринадцать"],
        14 : [2, 1, "четырнадцать"],
        15 : [2, 1, "пятнадцать"],
        16 : [2, 1, "шестнадцать"],
        17 : [2, 1, "семнадцать"],
        18 : [2, 1, "восемнадцать"],
        19 : [2, 1, "девятнадцать"],
        20 : [2, 1, "двадцать"],
        30 : [2, 1, "тридцать"],
        40 : [2, 1, "сорок"],
        50 : [2, 1, "пятьдесят"],
        60 : [2, 1, "шестьдесят"],
        70 : [2, 1, "семьдесят"],
        80 : [2, 1, "восемьдесят"],
        90 : [2, 1, "девяносто"],
        100 : [2, 1, "сто"],
        200 : [2, 1, "двести"],
        300 : [2, 1, "триста"],
        400 : [2, 1, "четыреста"],
        500 : [2, 1, "пятьсот"],
        600 : [2, 1, "шестьсот"],
        700 : [2, 1, "семьсот"],
        800 : [2, 1, "восемьсот"],
        900 : [2, 1, "девятьсот"]
    };

    var mapOrders = [
        { _Gender : true, _arrStates : ["рубль", "рубля", "рублей"] },
        { _Gender : false, _arrStates : ["тысяча", "тысячи", "тысяч"] },
        { _Gender : true, _arrStates : ["миллион", "миллиона", "миллионов"] },
        { _Gender : true, _arrStates : ["миллиард", "миллиарда", "миллиардов"] },
        { _Gender : true, _arrStates : ["триллион", "триллиона", "триллионов"] }
    ];

    var objKop = { _Gender : false, _arrStates : ["копейка", "копейки", "копеек"] };

    function Value(dVal, bGender) {
        var xVal = mapNumbers[dVal];
        if (xVal[1] == 1) {
            return xVal[2];
        } else {
            return xVal[2 + (bGender ? 0 : 1)];
        }
    }

    function From0To999(fValue, oObjDesc, fnAddNum, fnAddDesc)
    {
        var nCurrState = 2;
        if (Math.floor(fValue/100) > 0) {
            var fCurr = Math.floor(fValue/100)*100;
            fnAddNum(Value(fCurr, oObjDesc._Gender));
            nCurrState = mapNumbers[fCurr][0];
            fValue -= fCurr;
        }

        if (fValue < 20) {
            if (Math.floor(fValue) > 0) {
                fnAddNum(Value(fValue, oObjDesc._Gender));
                nCurrState = mapNumbers[fValue][0];
            }
        } else {
            var fCurr = Math.floor(fValue/10)*10;
            fnAddNum(Value(fCurr, oObjDesc._Gender));
            nCurrState = mapNumbers[fCurr][0];
            fValue -= fCurr;

            if (Math.floor(fValue) > 0) {
                fnAddNum(Value(fValue, oObjDesc._Gender));
                nCurrState = mapNumbers[fValue][0];
            }
        }

        fnAddDesc(oObjDesc._arrStates[nCurrState]);
    }

    var fInt = Math.floor(float + 0.005);
    var fDec = Math.floor(((float - fInt) * 100) + 0.5);

    var arrRet = [];
    var iOrder = 0;
    var arrThousands = [];
    for (; fInt > 0.9999; fInt/=1000) {
        arrThousands.push(Math.floor(fInt % 1000));
    }
    if (arrThousands.length == 0) {
        arrThousands.push(0);
    }

    function PushToRes(strVal) {
        arrRet.push(strVal);
    }

    for (var iSouth = arrThousands.length-1; iSouth >= 0; --iSouth) {
        if (arrThousands[iSouth] == 0) {
            continue;
        }
        From0To999(arrThousands[iSouth], mapOrders[iSouth], PushToRes, PushToRes);
    }

    if (arrThousands[0] == 0) {
        //  Handle zero amount
        if (arrThousands.length == 1) {
            PushToRes(Value(0, mapOrders[0]._Gender));
        }

        var nCurrState = 2;
        PushToRes(mapOrders[0]._arrStates[nCurrState]);
    }

    if (arrRet.length > 0) {
        // Capitalize first letter
        arrRet[0] = arrRet[0].match(/^(.)/)[1].toLocaleUpperCase() + arrRet[0].match(/^.(.*)$/)[1];
    }

    arrRet.push((fDec < 10) ? ("0" + fDec) : ("" + fDec));
    From0To999(fDec, objKop, function() {}, PushToRes);

    return arrRet.join(" ");
};


/**
 * Number to words
 * */
this.numberToWords = function(number, gender, postfix) {
    var gender_one = 'один';

    switch (gender) {
        case 'neuter' : {
            gender_one = 'одно';
        } break;

        case 'feminine' : {
            gender_one = 'одна';
        } break;

        case 'masculine' : {
            gender_one = 'один';
        } break;
    }

    if(number == 1){
        return gender_one;
    }

    var dictionary = [
        ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять",
            "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать",
            "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"],
        ["", "десять", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"],
        ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"],
        ["тысяч|а|и|", "миллион||а|ов", "миллиард||а|ов", "триллион||а|ов"]
    ];

    function getNumber(number, limit) {
        var temp = number.match(/^\d{1,3}([,|\s]\d{3})+/);
        if (temp) return temp[0].replace(/[,|\s]/g, "");
        temp = Math.abs(parseInt(number, 10));
        if (temp !== temp || temp > limit) return null;
        return String(temp);
    }

    function setEnding(variants, number) {
        variants = variants.split("|");
        number = number.charAt(number.length - 2) === "1" ? null : number.charAt(number.length - 1);
        switch (number) {
            case "1":
                return variants[0] + variants[1];
            case "2":
            case "3":
            case "4":
                return variants[0] + variants[2];
            default:
                return variants[0] + variants[3];
        }
    }

    function getPostfix(postfix, number) {
        if (typeof postfix === "string" || postfix instanceof String) {
            if (postfix.split("|").length < 3) return " " + postfix;
            return " " + setEnding(postfix, number);
        }
        return "";
    }


    if (typeof number === "undefined") return "999" + new Array(dictionary[3].length + 1).join(" 999");
    number = String(number);
    var minus = false;
    number.replace(/^\s+/, "").replace(/^-\s*/, function () {
        minus = true;
        return "";
    });
    number = getNumber(number, Number(new Array(dictionary[3].length + 2).join("999")));
    if (!number) return "";
    postfix = getPostfix(postfix, number);
    if (number === "0") return "ноль" + postfix;
    var position = number.length,
        i = 0,
        j = 0,
        result = [];
    while (position--) {
        result.unshift(dictionary[i++][number.charAt(position)]);
        if (i === 2 && number.charAt(position) === "1") result.splice(0, 2, dictionary[0][number.substring(position, position + 2)]);
        if (i === 3 && position !== 0) {
            i = 0;
            if (position > 3 && number.substring(position - 3, position) === "000") {
                j++;
                continue;
            }
            result.unshift(setEnding(dictionary[3][j++], number.substring(0, position)));
        }
    }
    position = result.length - 5;
    switch (result[position]) {
        case "один":
            result[position] = "одна";
            break;
        case "два":
            result[position] = "две";
            break;
    }
    if (minus) result.unshift("минус");

    if(result[result.length-1] == 'один'){
        result[result.length-1] = gender_one;
    }

    return result.join(" ").replace(/\s+$/, "").replace(/\s+/g, " ") + postfix;
};


/**
 * Plural form
 * */
this.pluralForm = function(i, str1, str3, str5){
    function plural (a){
        if ( a % 10 == 1 && a % 100 != 11 ) return 0
        else if ( a % 10 >= 2 && a % 10 <= 4 && ( a % 100 < 10 || a % 100 >= 20)) return 1
        else return 2;
    }

    switch (plural(i)) {
        case 0: return str1;
        case 1: return str3;
        default: return str5;
    }
};


/**
 * Zero pad
 * */
this.pad = function(number, length) {
    var str = '' + number;

    while (str.length < length) {
        str = '0' + str;
    }

    return str;
};


/**
 * Random seed
 * */
this.generateRandomSeed = function(){
    var seed = Math.random().toString(),
        md5 = crypto.createHash('md5');

    if(arguments.length > 0){
        for(var i = 0, l = arguments.length; i < l; i++){
            seed += arguments[i];
        }
    }

    md5.update(seed);

    return md5.digest('hex');
};


/**
 * Create pdf
 * */
this.generatePDF = function(url, sid, res, fname){
    var random_name = this.generateRandomSeed(sid),
        pdf_filename = __dirname + '/../generated/tmp/pdf/' + random_name + '.pdf';

    exec('wkhtmltopdf --cookie connect.sid ' + sid + ' ' + url + ' ' + pdf_filename, function (err, stdout, stderr) {
        if(!err){
            fs.readFile(pdf_filename, function (err, data) {
                if (err) {res.writeHead(400); res.end("" + err); return;} // TODO make here a 500 error (for testing use an wrong var pdf_filename)

                fs.unlink(pdf_filename, function(){});

                res.setHeader('Content-disposition', "attachment; filename*=UTF-8''" + encodeURIComponent(fname) + ".pdf");
                res.setHeader('Content-type', 'application/pdf');

                res.end(data);
            });
        }else{
            res.end('PDF generate error');
        }
    });
};