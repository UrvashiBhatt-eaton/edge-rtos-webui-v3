/**
 * Converts IEEE 754 Floating-Point32 to Hex
 *
 * @param {*} float32   eg: 12.345
 * @returns             eg: 0x4145851F
 */
export const Float32ToHex = (float32) => {
  const getHex = (i) => ("00" + i.toString(16)).slice(-2);
  var view = new DataView(new ArrayBuffer(4));
  view.setFloat32(0, float32);
  return Array.apply(null, { length: 4 })
    .map((_, i) => getHex(view.getUint8(i)))
    .join("");
};

/**
 * Converts IEEE 754 Floating-Point64 to Hex
 *
 * @param {*} float64   eg: 12.345
 * @returns             eg: 0x4028b0a3d70a3d71
 */
export const Float64ToHex = (float64) => {
  const getHex = (i) => ("00" + i.toString(16)).slice(-2);
  var view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, float64);
  return Array.apply(null, { length: 8 })
    .map((_, i) => getHex(view.getUint8(i)))
    .join("");
};

/**
 * Converts Hex to IEEE 754 Floating-Point32
 *
 * @param {*} str   eg: 0x4145851F
 * @returns         eg: 12.345000267028809
 */
export const HexToFloat32 = (str) => {
  var int = parseInt(str, 16);
  if (int > 0 || int < 0) {
    var sign = int >>> 31 ? -1 : 1;
    var exp = ((int >>> 23) & 0xff) - 127;
    var mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
    var float32 = 0;
    for (let i = 0; i < mantissa.length; i += 1) {
      float32 += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
      exp--;
    }
    return (float32 * sign).toFixed(3);
  } else return 0;
};

/**
 * Converts Hex to IEEE 754 Floating-Point64
 *
 * @param {*} str
 * @returns
 */
export const HexToFloat64 = (str) => {
  let firtPart = str.substring(0, 10);
  let secondPart = "0x" + str.substring(10);
  let sign = firtPart >> 31 ? -1 : 1;
  let exp = ((firtPart >> (52 - 32)) & 0x7ff) - 1023;
  let result =
    ((((firtPart & 0xfffff) | 0x100000) * 1.0) / Math.pow(2, 52 - 32)) * Math.pow(2, exp) +
    ((secondPart * 1.0) / Math.pow(2, 52)) * Math.pow(2, exp);
  return result * sign;
};

/**
 * Rounding up values after decimal point for presicion
 *
 * @param {*} str   eg: 12.345000267028809
 * @returns         eg: 12.345
 */
export const RoundUp = (str) => {
  let afterDecNum = "";
  let result = "";
  let temp = str.split(".");

  if (temp[1] != undefined) {
    for (let i = 0; i < temp[1].length; i++) {
      if (temp[1][i] == 0 && temp[1][i + 1] == 0) {
        //exit the loop
        break;
      } else if (temp[1][i + 1] == 9 && temp[1][i + 2] == 9) {
        afterDecNum += temp[1][i] + 1;
        break;
      } else {
        afterDecNum += temp[1][i];
      }
    }
    result = temp[0] + "." + afterDecNum;
  } else {
    result = str;
  }
  return result;
};
