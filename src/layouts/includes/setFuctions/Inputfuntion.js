export const isNumber = (e) => { //ตัวเลข และ backspace เท่านั้น
  var key = e.which || e.keyCode;
  if (key && (key <= 47 || key >= 58) && key != 8) {
    e.preventDefault();
  }
}

export const idCardCheck = (value) => { //ตัวสอบเลขบัตรประชาชน
  if(value.substring(0,1)== 0) return false;
  if(value.length != 13) return false;
  for(var i=0, sum=0; i < 12; i++)
  sum += parseFloat(value.charAt(i))*(13-i);
  if((11-sum%11)%10!=parseFloat(value.charAt(12))) return false;
  return true;
}
