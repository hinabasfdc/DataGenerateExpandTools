'use strict'

window.onload = () => {

  const canvas = document.querySelector('.canvas01');
  const ctx = canvas.getContext('2d');

  let isDrag = false;
  let posEnd = { x: null, y: null };
  let posStart = { x: null, y: null };

  const draw = (x, y) => {
    if (!isDrag) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWith = 1;
    ctx.strokeStyle = '#000000';

    if (posEnd.x === null || posEnd.y === null) {
      ctx.moveTo(x, y);
    } else {
      ctx.moveTo(posEnd.x, posEnd.y);
    }

    ctx.lineTo(x, y);
    ctx.stroke();

    posEnd.x = x;
    posEnd.y = y;
  }

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  const dragStart = (e) => {
    ctx.beginPath();
    isDrag = true;
  }

  const dragEnd = () => {
    ctx.closePath();
    isDrag = false;
    posEnd.x = null;
    posEnd.y = null;
  }

  const getValues = (outputStyle) => {
    console.log('[DEBUG] Start getValues.');

    const max_h = canvas.height;
    const max_w = canvas.width;

    const y_axis_max = document.querySelector('.y-axis-max').value || 360;

    let x_axis_max = 730;
    if (document.querySelector('.radio-numberformat').checked) {
      x_axis_max = document.querySelector('.x-axis-max').value || 730;
    } else if (document.querySelector('.radio-dateformat').checked) {
      let startdate = new Date(document.querySelector('.start-date').value);
      let enddate = new Date(document.querySelector('.end-date').value);
      x_axis_max = (enddate - startdate) / 86400000;
    }

    if (y_axis_max > 360) y_axis_max = 360;
    if (x_axis_max > 730) x_axis_max = 730;

    const y_ratio = y_axis_max / max_h;

    let arrayFull = [];
    for (let iw = 0; iw <= max_w; iw++) {
      for (let ih = max_h - 1; ih >= 0; ih--) {
        let pixel = ctx.getImageData(iw, ih, 1, 1);
        if (pixel.data[3] != 0) {
          let y = Math.round((max_h - ih) * y_ratio);
          arrayFull.push(y);
          break;
        } else if (ih == 0) {
          arrayFull.push(0);
        }
      }
    }

    console.log(arrayFull.length);

    let bucketArray = [];
    let quotient = Math.floor(max_w / x_axis_max);
    let remainder = max_w % x_axis_max;
    for(let i = 0; i < (x_axis_max - remainder); i++){
      bucketArray.push(quotient);
    }
    for(let i = 0; i < remainder; i++){
      bucketArray.push(quotient + 1);
    }
    // シャッフル
    for(let i = bucketArray.length - 1; i >= 0; i--){
      const r = Math.floor(Math.random() * (i + 1));
      [bucketArray[i], bucketArray[r]] = [bucketArray[r], bucketArray[i]];
    }

    let arrayOutput = [];
    let indexFull = 0;
    let bucketH = 0;
    let total = 0;
    for (let i = 0; i < bucketArray.length; i++) {
      let steps = bucketArray[i];
      for(let s = 0; s < steps; s++){
        bucketH += arrayFull[indexFull];
        indexFull++;
      }

      let average_y = Math.round(bucketH / steps)
      total += average_y;
      arrayOutput.push(average_y);

      bucketH = 0;
    }

    if (outputStyle == 'culcurateTotal') {
      document.querySelector('.area-result').innerHTML = total;

    } else if (outputStyle == 'outputForTable') {
      let output = '<table>';
      let linenum = 1;
      for (let i = 0; i <= arrayOutput.length; i++) {
        let linenumofsamples = arrayOutput[i];
        if (linenumofsamples > 0) {
          for (let j = 0; j < linenumofsamples; j++) {

            if (document.querySelector('.radio-numberformat').checked) {
              output += '<tr><td>' + linenum + '</td><td>' + (i + 1) + '</td><td>1</td></tr>';
            
            } else if (document.querySelector('.radio-dateformat').checked) {
              let date = new Date(document.querySelector('.start-date').value);
              date.setDate(date.getDate() + i);
              output += '<tr><td>' + linenum + '</td><td>' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '</td><td>1</td></tr>';
            }
            linenum++;
          }
        }
      }
      output += '</table>';
      document.querySelector('.area-result').innerHTML = output;
    }
  }

  const focusResult = () => {
    let range = document.createRange();
    range.selectNodeContents(document.querySelector('.area-result'));
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  }

  canvas.addEventListener('mousedown', dragStart);
  canvas.addEventListener('mouseup', dragEnd);
  canvas.addEventListener('mouseout', dragEnd);
  canvas.addEventListener('mousemove', (e) => {
    draw(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
  });

  document.querySelector('.btn-clear').addEventListener('click', clear);
  document.querySelector('.btn-getnumofsamples').addEventListener('click', () => {
    getValues('culcurateTotal');
  });
  document.querySelector('.btn-outputfortable').addEventListener('click', () => {
    getValues('outputForTable');
  });
  document.querySelector('.btn-copyforclipboard').addEventListener('click', focusResult);

}