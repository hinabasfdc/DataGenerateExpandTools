'use strict'

const SRC_GENDER = ['女性', '男性', 'その他'];
const SRC_STATE = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];

const createRandamData = () => {
  const MAXNUMBER = document.getElementById('maxnumber').value;

  let output = '<table>';
  let obj = {};

  //// UUID ////
  if (document.getElementById('checkbox-uuid').checked) {
    let array = [];
    for (let i = 0; i < MAXNUMBER; i++) {
      array.push(generateUuid());
    }

    obj.uuid = array;
  }

  //// 性別 ////
  if (document.getElementById('checkbox-gender').checked) {
    let array = [];
    for (let i = 0; i < MAXNUMBER; i++) {
      array.push(SRC_GENDER[getRandamNumber(0, 1)]);
    }

    obj.gender = array;
  }

  //// 姓 ////
  if (document.getElementById('checkbox-lastname').checked) {
    let array = [];
    for (let i = 0; i < MAXNUMBER; i++) {
      array.push(SRC_LASTNAME[getRandamNumber(0, SRC_LASTNAME.length - 1)][0]);
    }

    obj.lastname = array;
  }

  //// 名 ////
  if (document.getElementById('checkbox-firstname').checked) {
    let array = [];
    const SRC_FIRSTNAME = SRC_FIRSTNAME_FEMALE.concat(SRC_FIRSTNAME_MALE);

    for (let i = 0; i < MAXNUMBER; i++) {
      if (document.getElementById('checkbox-gender').checked) {
        if (obj.gender[i] === '女性') array.push(SRC_FIRSTNAME_FEMALE[getRandamNumber(0, SRC_FIRSTNAME_FEMALE.length - 1)][0]);
        else if (obj.gender[i] === '男性') array.push(SRC_FIRSTNAME_MALE[getRandamNumber(0, SRC_FIRSTNAME_MALE.length - 1)][0]);
        else array.push(SRC_FIRSTNAME[getRandamNumber(0, SRC_FIRSTNAME.length - 1)][0]);
      } else {
        array.push(SRC_FIRSTNAME[getRandamNumber(0, SRC_FIRSTNAME.length - 1)][0]);
      }
    }

    obj.firstname = array;
  }

  //// 生年月日/年齢 ////
  if (document.getElementById('checkbox-ageandbirthdate').checked) {
    let arrayAge = [];
    let arrayBirthdate = [];

    const AGE_START = parseInt(document.getElementById('age-start').value) || 21;
    const AGE_END = parseInt(document.getElementById('age-end').value) || 70;

    for (let i = 0; i < MAXNUMBER; i++) {
      const AGE = getRandamNumber(AGE_START, AGE_END);
      arrayAge.push(AGE);

      let birthdate = new Date();
      birthdate.setFullYear(birthdate.getFullYear() - parseInt(AGE));
      birthdate.setDate(birthdate.getDate() - getRandamNumber(1, 365));
      arrayBirthdate.push(birthdate);
    }

    obj.age = arrayAge;
    obj.birthdate = arrayBirthdate;
  }

  //// 電話番号 ////
  if (document.getElementById('checkbox-tel').checked) {
    let array = [];
    for (let i = 0; i < MAXNUMBER; i++) {
      array.push('0500' + leftPad(getRandamNumber(1111111, 9999999), 7));
    }

    obj.tel = array;
  }

  //// 電子メール ////
  if (document.getElementById('checkbox-email').checked) {
    let array = [];
    for (let i = 0; i < MAXNUMBER; i++) {
      array.push(getRandamChars() + '.demo@example.com');
    }

    obj.email = array;
  }

  //// 会社名 ////
  if (document.getElementById('checkbox-companyname').checked) {
    let array = [];
    for (let i = 0; i < MAXNUMBER; i++) {
      let COMPANYNAME = SRC_LASTNAME[getRandamNumber(0, SRC_LASTNAME.length - 1)][0];
      if (document.getElementById('checkbox-companyname-additional').checked) COMPANYNAME += SRC_INDUSTRY[getRandamNumber(0, SRC_INDUSTRY.length - 1)][1];
      array.push(COMPANYNAME);
    }

    obj.companyname = array;
  }

  //// 住所 ////
  if (document.getElementById('checkbox-address').checked) {
    let arrayState = [];
    let arrayZipcode = [];
    let arrayCity = [];
    let arrayStreet = [];

    let SRC_SELECTEDSTATE = [];
    if (document.getElementById('checkbox-address-all').checked) {
      SRC_SELECTEDSTATE = SRC_STATE;
    } else {
      if (document.getElementById('checkbox-address-hokkaido').checked) SRC_SELECTEDSTATE.push('北海道');
      if (document.getElementById('checkbox-address-aomori').checked) SRC_SELECTEDSTATE.push('青森県');
      if (document.getElementById('checkbox-address-iwate').checked) SRC_SELECTEDSTATE.push('岩手県');
      if (document.getElementById('checkbox-address-miyagi').checked) SRC_SELECTEDSTATE.push('宮城県');
      if (document.getElementById('checkbox-address-akita').checked) SRC_SELECTEDSTATE.push('秋田県');
      if (document.getElementById('checkbox-address-yamagata').checked) SRC_SELECTEDSTATE.push('山形県');
      if (document.getElementById('checkbox-address-fukushima').checked) SRC_SELECTEDSTATE.push('福島県');

      if (document.getElementById('checkbox-address-ibaraki').checked) SRC_SELECTEDSTATE.push('茨城県');
      if (document.getElementById('checkbox-address-tochigi').checked) SRC_SELECTEDSTATE.push('栃木県');
      if (document.getElementById('checkbox-address-gunma').checked) SRC_SELECTEDSTATE.push('群馬県');
      if (document.getElementById('checkbox-address-saitama').checked) SRC_SELECTEDSTATE.push('埼玉県');
      if (document.getElementById('checkbox-address-chiba').checked) SRC_SELECTEDSTATE.push('千葉県');
      if (document.getElementById('checkbox-address-tokyo').checked) SRC_SELECTEDSTATE.push('東京都');
      if (document.getElementById('checkbox-address-kanagawa').checked) SRC_SELECTEDSTATE.push('神奈川県');

      if (document.getElementById('checkbox-address-niigata').checked) SRC_SELECTEDSTATE.push('新潟県');
      if (document.getElementById('checkbox-address-toyama').checked) SRC_SELECTEDSTATE.push('富山県');
      if (document.getElementById('checkbox-address-ishikawa').checked) SRC_SELECTEDSTATE.push('石川県');
      if (document.getElementById('checkbox-address-fukui').checked) SRC_SELECTEDSTATE.push('福井県');
      if (document.getElementById('checkbox-address-yamanashi').checked) SRC_SELECTEDSTATE.push('山梨県');
      if (document.getElementById('checkbox-address-nagano').checked) SRC_SELECTEDSTATE.push('長野県');

      if (document.getElementById('checkbox-address-gifu').checked) SRC_SELECTEDSTATE.push('岐阜県');
      if (document.getElementById('checkbox-address-shizuoka').checked) SRC_SELECTEDSTATE.push('静岡県');
      if (document.getElementById('checkbox-address-aichi').checked) SRC_SELECTEDSTATE.push('愛知県');
      if (document.getElementById('checkbox-address-mie').checked) SRC_SELECTEDSTATE.push('三重県');

      if (document.getElementById('checkbox-address-shiga').checked) SRC_SELECTEDSTATE.push('滋賀県');
      if (document.getElementById('checkbox-address-kyoto').checked) SRC_SELECTEDSTATE.push('京都府');
      if (document.getElementById('checkbox-address-osaka').checked) SRC_SELECTEDSTATE.push('大阪府');
      if (document.getElementById('checkbox-address-hyogo').checked) SRC_SELECTEDSTATE.push('兵庫県');
      if (document.getElementById('checkbox-address-nara').checked) SRC_SELECTEDSTATE.push('奈良県');
      if (document.getElementById('checkbox-address-wakayama').checked) SRC_SELECTEDSTATE.push('和歌山県');

      if (document.getElementById('checkbox-address-tottori').checked) SRC_SELECTEDSTATE.push('鳥取県');
      if (document.getElementById('checkbox-address-shimane').checked) SRC_SELECTEDSTATE.push('島根県');
      if (document.getElementById('checkbox-address-okayama').checked) SRC_SELECTEDSTATE.push('岡山県');
      if (document.getElementById('checkbox-address-hiroshima').checked) SRC_SELECTEDSTATE.push('広島県');
      if (document.getElementById('checkbox-address-yamaguchi').checked) SRC_SELECTEDSTATE.push('山口県');

      if (document.getElementById('checkbox-address-tokushima').checked) SRC_SELECTEDSTATE.push('徳島県');
      if (document.getElementById('checkbox-address-kagawa').checked) SRC_SELECTEDSTATE.push('香川県');
      if (document.getElementById('checkbox-address-ehime').checked) SRC_SELECTEDSTATE.push('愛媛県');
      if (document.getElementById('checkbox-address-kochi').checked) SRC_SELECTEDSTATE.push('高知県');

      if (document.getElementById('checkbox-address-fukuoka').checked) SRC_SELECTEDSTATE.push('福岡県');
      if (document.getElementById('checkbox-address-saga').checked) SRC_SELECTEDSTATE.push('佐賀県');
      if (document.getElementById('checkbox-address-nagasaki').checked) SRC_SELECTEDSTATE.push('長崎県');
      if (document.getElementById('checkbox-address-kumamoto').checked) SRC_SELECTEDSTATE.push('熊本県');
      if (document.getElementById('checkbox-address-oita').checked) SRC_SELECTEDSTATE.push('大分県');
      if (document.getElementById('checkbox-address-miyazaki').checked) SRC_SELECTEDSTATE.push('宮崎県');
      if (document.getElementById('checkbox-address-kagoshima').checked) SRC_SELECTEDSTATE.push('鹿児島県');
      if (document.getElementById('checkbox-address-okinawa').checked) SRC_SELECTEDSTATE.push('沖縄県');
    }

    for (let i = 0; i < MAXNUMBER; i++) {
      let state = SRC_SELECTEDSTATE[getRandamNumber(0, SRC_SELECTEDSTATE.length - 1)];
      let line = SRC_ZIPADDRESS[state][getRandamNumber(0, SRC_ZIPADDRESS[state].length - 1)];

      arrayZipcode.push(leftPad(line[0], 7));
      arrayState.push(state);
      arrayCity.push(line[1]);
      arrayStreet.push(line[2]);
    }

    obj.zipcode = arrayZipcode;
    obj.state = arrayState;
    obj.city = arrayCity;
    obj.street = arrayStreet;
  }

  //// 数 ////
  if (document.getElementById('checkbox-number').checked) {
    let array = [];
    const NUMBER_START = parseInt(document.getElementById('number-start').value) || 1;
    const NUMBER_END = parseInt(document.getElementById('number-end').value) || 100;

    for (let i = 0; i < MAXNUMBER; i++) {
      array.push(getRandamNumber(NUMBER_START, NUMBER_END));
    }

    obj.number = array;
  }

  //// 数（正規分布） ////
  if (document.getElementById('checkbox-normrand').checked) {
    let array = [];
    const AVERAGE = parseInt(document.getElementById('normrand-average').value) || 100;
    const SIGMA = parseInt(document.getElementById('normrand-sigma').value) || 50;

    for (let i = 0; i < MAXNUMBER; i++) {
      array.push(getNormRand(AVERAGE, SIGMA));
    }

    obj.number = array;
  }

  //// 数（線形回帰） ////
  if (document.getElementById('checkbox-linearregression').checked) {
    let arrayX = [];
    let arrayY = [];
    const SLOPE = parseFloat(document.getElementById('linearregression-slope').value) || 1;
    const INTERCEPT = parseFloat(document.getElementById('linearregression-intercept').value) || 100;
    const X_AVERAGE = parseInt(document.getElementById('linearregression-x-average').value) || 100;
    const X_SIGMA = parseInt(document.getElementById('linearregression-x-sigma').value) || 50;
    const Y_SIGMA = parseInt(document.getElementById('linearregression-y-sigma').value) || 10;

    for (let i = 0; i < MAXNUMBER; i++) {
      let X = getNormRand(X_AVERAGE,X_SIGMA);
      let Y = getNormRand((SLOPE * X + INTERCEPT),Y_SIGMA);

      arrayX.push(X);
      arrayY.push(Y);
    }

    obj.x = arrayX;
    obj.y = arrayY;
  }

  //// 日付 ////
  if (document.getElementById('checkbox-date').checked) {
    const DATESTART = new Date(document.getElementById('date-start').value);
    const DATEEND = new Date(document.getElementById('date-end').value);
    const DURATION = (DATEEND - DATESTART) / 86400000;

    const MIN = parseInt(document.getElementById('date-duration-min').value);
    const MAX = parseInt(document.getElementById('date-duration-max').value);

    let arrayDate2 = [];
    let arrayDate1 = [];
    for (let i = 0; i < MAXNUMBER; i++) {
      let DATE = new Date(DATESTART);
      arrayDate2.push(DATE.setDate(DATE.getDate() + getRandamNumber(0, DURATION)));
      arrayDate1.push(DATE.setDate(DATE.getDate() - getRandamNumber(MIN, MAX)));
    }
    
    obj.date1 = arrayDate1;
    obj.date2 = arrayDate2;
  }

  //// 元データ1 ////
  if (document.getElementById('checkbox-text1').checked) {
    let lines = document.getElementById('text1').value.replace(/\r\n|\r/g, '\n').replace(/^\n/gm, '').split('\n');
    let ratios = document.getElementById('text1-ratio').value.replace(/\r\n|\r/g, '\n').replace(/^\n/gm, '').split('\n');

    let ratioLines = [];
    for (let i = 0; i < lines.length; i++) {
      if (i < ratios.length) {
        for (let r = 0; r < ratios[i]; r++) {
          ratioLines.push(lines[i]);
        }
      } else {
        ratioLines.push(lines[i]);
      }
    }

    console.log(ratioLines);

    let array = [];
    for (let j = 0; j < MAXNUMBER; j++) {
      array.push(ratioLines[getRandamNumber(0, ratioLines.length - 1)]);
    }

    obj.text1 = array;
  }

  //// 書き出し ////
  for (let i = 0; i < MAXNUMBER; i++) {
    output += '<tr>';

    const keys = Object.keys(obj);
    for (let j = 0; j < keys.length; j++) {

      if (keys[j] === 'date1' || keys[j] === 'date2' || keys[j] === 'birthdate') {
        const DATE = new Date(obj[keys[j]][i]);
        output += '<td>' + DATE.getFullYear() + '-' + leftPad((DATE.getMonth() + 1), 2) + '-' + leftPad(DATE.getDate(), 2) + '</td>';
      } else {
        output += '<td>' + obj[keys[j]][i] + '</td>';
      }

    }

    output += '</tr>';
  }

  output += '</table>';
  document.getElementById('area-result').innerHTML = output;
  console.log(obj);
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

const generateUuid = () => {
  let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case "x":
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case "y":
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
    }
  }
  return chars.join("");
}

const getNormRand = (m, s) => {

  let retval = m;
  for(let i = 0; i < 10; i++) {
    let a = 1 - Math.random();
    let b = 1 - Math.random();
    let c = Math.sqrt(-2 * Math.log(a));
    if(0.5 - Math.random() > 0) {
        retval = c * Math.sin(Math.PI * 2 * b) * s + m;
    }else{
        retval = c * Math.cos(Math.PI * 2 * b) * s + m;
    }

    if(retval >= m - s && retval <= m + s) break;
  }

  return parseInt(retval);
};

const focusResult = () => {
  let range = document.createRange();
  range.selectNodeContents(document.getElementById('area-result'));
  window.getSelection().addRange(range);
  document.execCommand('copy');
}