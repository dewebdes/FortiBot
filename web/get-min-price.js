var prcol = document.querySelectorAll('.bid-data-inner .number');
//document.querySelectorAll('.c-exchange-fixedheight')[3].querySelectorAll('.body-price');
var totalprc = 0;
var baseprc = parseFloat(document.querySelectorAll('.price')[1].innerText);
var dvcounter = 0;
for (var i = 0; i <= prcol.length - 1; i++) {
    if (baseprc > parseFloat(prcol[i].innerText)) {
        totalprc += parseFloat(prcol[i].innerText);
        dvcounter++;
    }
}
var res1 = parseFloat(totalprc / dvcounter);

var prcol = document.querySelectorAll('.c-exchange-fixedheight')[3].querySelectorAll('.body-price');
var totalprc = 0;
var baseprc = parseFloat(document.querySelectorAll('.price')[1].innerText);
var dvcounter = 0;
for (var i = 0; i <= prcol.length - 1; i++) {
    //if (baseprc > parseFloat(prcol[i].innerText)) {
        totalprc += parseFloat(prcol[i].innerText);
        dvcounter++;
    //}
}
var res2 = parseFloat(totalprc / dvcounter);

var res = (res1 + res2) / 2;
console.log(res);
