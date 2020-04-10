'use strict'

const createExpandData = () => {
  console.log('[DEBUG] Start createExpandData');

  let lines = document.getElementById('text1').value.replace(/\r\n|\r/g, '\n').replace(/^\n/gm, '').split('\n');
  let array = [];

  for (let i = 0; i < lines.length; i++) {
    if (document.getElementById('radio-simple').checked) {
      for (let j = 0; j < parseInt(document.getElementById('simple-number').value); j++) {
        array.push(lines[i]);
      }
    } else if (document.getElementById('radio-randam').checked) {
      let maxnum = getRandamNumber(parseInt(document.getElementById('randam-minnum').value), parseInt(document.getElementById('randam-maxnum').value));
      for (let j = 0; j < maxnum; j++) {
        array.push(lines[i]);
      }
    } else if (document.getElementById('radio-normrand').checked) {
      let maxnum = getNormRand(parseInt(document.getElementById('normrand-average').value), parseInt(document.getElementById('normrand-sigma').value));
      for (let j = 0; j < maxnum; j++) {
        array.push(lines[i]);
      }
    } else if (document.getElementById('radio-datedurationrandam').checked) {
      const bufarray = lines[i].split(',');
      const datestart = new Date(bufarray[1]);
      const dateend = new Date(bufarray[2]);
      const DURATION = (dateend - datestart) / 86400000;

      let maxnum = getRandamNumber(parseInt(document.getElementById('datedurationrandam-min').value), parseInt(document.getElementById('datedurationrandam-max').value));
      for (let j = 0; j < maxnum; j++) {
        let DATE = new Date(datestart);
        DATE.setDate(DATE.getDate() + getRandamNumber(0, DURATION))
        array.push(bufarray[0] + ',' + DATE.getFullYear() + '-' + leftPad((DATE.getMonth() + 1), 2) + '-' + leftPad(DATE.getDate(), 2));
      }
    }
  }

  //// 書き出し ////
  let output = '<table>';
  for (let k = 0; k < array.length; k++) {
    output += '<tr>';

    if(document.getElementById('radio-datedurationrandam').checked){
      const LINE = array[k].split(',');
      console.log(LINE);

      if(document.getElementById('radio-table').checked){
        output += '<td>' + LINE[0] + '</td><td>' + LINE[1] + '</td>';
      }else if(document.getElementById('radio-comma').checked){
        output += '<td>' + LINE[0] + ',' + LINE[1] + ',</td>';
      }
    }else{
      output += '<td>' + array[k] + '</td>';
    }
    output += '</tr>'
  }
  output += '</table>';

  document.getElementById('area-result').innerHTML = output;
}

/*
* Helper 系関数
*/

const getRandamNumber = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

const getRandamChars = () => {
  return Math.random().toString(36).slice(-8);
}

const leftPad = (num, digits) => {
  return ('0000000000' + num).slice(-digits);
}

const getNormRand = (m, s) => {

  let retval = m;
  for (let i = 0; i < 10; i++) {
    let a = 1 - Math.random();
    let b = 1 - Math.random();
    let c = Math.sqrt(-2 * Math.log(a));
    if (0.5 - Math.random() > 0) {
      retval = c * Math.sin(Math.PI * 2 * b) * s + m;
    } else {
      retval = c * Math.cos(Math.PI * 2 * b) * s + m;
    }

    if (retval >= m - s && retval <= m + s) break;
  }

  return parseInt(retval);
};

const focusResult = () => {
  let range = document.createRange();
  range.selectNodeContents(document.getElementById('area-result'));
  window.getSelection().addRange(range);
  document.execCommand('copy');
}