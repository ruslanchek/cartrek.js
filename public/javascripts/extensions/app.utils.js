app.utils = {
    humanizeDate: function (date, output_with_time) {
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
    },

    humanizePrice: function(price){
        return numeral(price).format('0,0.00');
    },

    priceToWords: function(float){
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
    },

    numberToWords: function(number, gender, postfix) {
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
    },

    pluralForm: function(i, str1, str3, str5){
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
    },

    makeId: function(l){
        if(l < 0){
            l = 5;
        }

        var text = "",
            chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for(var i = 0; i < l; i++){
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return text;
    }
};