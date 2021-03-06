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
    //console.log('[DEBUG] Start getValues.');

    const max_h = canvas.height;
    const max_w = canvas.width;

    // 縦の最大数を設定
    const y_axis_max = document.querySelector('.y-axis-max').value || 360;
    if (y_axis_max > 360) y_axis_max = 360;
    const y_ratio = y_axis_max / max_h;

    // 横の最大数を設定
    let x_axis_max = 730;
    if (document.querySelector('.radio-numberformat').checked) {
      x_axis_max = document.querySelector('.x-axis-max').value || 730;
    } else if (document.querySelector('.radio-dateformat').checked) {
      let startdate = new Date(document.querySelector('.start-date').value);
      let enddate = new Date(document.querySelector('.end-date').value);
      x_axis_max = ((enddate - startdate) / 86400000) + 1;
    }
    if (x_axis_max > 730) x_axis_max = 730;

    // 最大解像度での配列を作成
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
    //console.log(arrayFull.length);

    // 横のバケットサイズの配列を作成
    let bucketArray = [];
    let quotient = Math.floor(max_w / x_axis_max);
    let remainder = max_w % x_axis_max;
    for (let i = 0; i < (x_axis_max - remainder); i++) {
      bucketArray.push(quotient);
    }
    for (let i = 0; i < remainder; i++) {
      bucketArray.push(quotient + 1);
    }
    // シャッフル
    for (let i = bucketArray.length - 1; i >= 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      [bucketArray[i], bucketArray[r]] = [bucketArray[r], bucketArray[i]];
    }

    // 指定の横のサイズでの配列を作成
    let arrayOutput = [];
    let indexFull = 0;
    let bucketH = 0;
    for (let i = 0; i < bucketArray.length; i++) {
      let steps = bucketArray[i];
      for (let s = 0; s < steps; s++) {
        bucketH += arrayFull[indexFull];
        indexFull++;
      }

      let average_y = Math.round(bucketH / steps)
      arrayOutput.push(average_y);

      bucketH = 0;
    }

    //一時的な合計サンプル数を計算
    let total = 0;
    for (let i = 0; i < arrayOutput.length; i++) {
      total += arrayOutput[i];
    }

    // 最大値以上であれば間引く
    if (document.querySelector('.chkbox-maxlines').checked && document.querySelector('.maxlines').value) {
      let diff = total - document.querySelector('.maxlines').value;

      if (diff > arrayOutput.length) {
        let output = '<p>間引き対象数 ' + diff + ' が、x軸分割数 ' + arrayOutput.length + ' より大きいため実行できません。y軸の最大数を減らして全体数を調整してから再度実行してください。</p>';
        document.querySelector('.area-result').innerHTML = output;
        return;
      }

      let adjustproceed = 0;
      for (let i = 0; i < diff; i++) {
        let rndnum = Math.floor(Math.random() * (arrayOutput.length));
        arrayOutput[rndnum] -= 1;

        // もし 0 以下になった場合は 0 に変更
        if(arrayOutput[rndnum] < 0){
          arrayOutput[rndnum] = 0;
          i--;
          adjustproceed++;
        } 

        // 補正回数が横幅最大数を超えた場合
        if(adjustproceed > arrayOutput.length){
          let output = '<p>間引き補正回数(0以下の場合に0に戻す)が、x軸分割数 ' + arrayOutput.length + ' を超えました。y軸の最大数を減らして全体数を調整してから再度実行してください。</p>';
          document.querySelector('.area-result').innerHTML = output;
          return;
        }
      }
    }

    //最終的な合計サンプル数を計算
    total = 0;
    for (let i = 0; i < arrayOutput.length; i++) {
      total += arrayOutput[i];
    }

    //// ここから最終出力を生成
    // 横軸でのサンプル数表示
    if (outputStyle == 'culcurateTotal') {
      let header = '';
      let values = '';
      for (let i = 0; i < arrayOutput.length; i++) {
        header += '<td>' + (i + 1) + '</td>';
        values += '<td>' + arrayOutput[i] + '</td>';
      }
      document.querySelector('.area-result').innerHTML = '<table class="resulttable"><tr><td>total</td>' + header + '</tr><tr><td>' + total + '</td>' + values + '</tr></table>';

    // テーブル形式での出廬y区
    } else if (outputStyle == 'outputForTable') {
      let output = '<table class="resulttable">';
      let linenum = 1;
      for (let i = 0; i <= arrayOutput.length; i++) {
        let linenumofsamples = arrayOutput[i];
        if (linenumofsamples > 0) {
          for (let j = 0; j < linenumofsamples; j++) {

            // 数値出力
            if (document.querySelector('.radio-numberformat').checked) {
              output += '<tr><td>' + linenum + '</td><td>' + (i + 1) + '</td><td>1</td></tr>';

            // 日付出力
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

  // テーブルエリアを選択状態にしてクリップボードコピーを実行
  const focusResult = () => {
    let range = document.createRange();
    range.selectNodeContents(document.querySelector('.area-result'));
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  }

  // 各種イベントを設定
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