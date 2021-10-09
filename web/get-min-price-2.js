var maxp = parseFloat(document.querySelectorAll('.text.fullwidth')[1].innerText);
var minp = parseFloat(document.querySelectorAll('.text.fullwidth')[2].innerText);
var baseprc = parseFloat(document.querySelectorAll('.price')[1].innerText);
var res = (maxp + minp + baseprc) / 3;
alert(res);