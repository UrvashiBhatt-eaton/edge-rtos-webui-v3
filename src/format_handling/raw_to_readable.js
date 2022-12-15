import { HexToFloat32, HexToFloat64, RoundUp } from "./helper_functions";

/**
 * JavaScript file to maintain the Format Handlers
 * to convert Raw value from device to Readable value which would be displayed on the UI
 *
 * @param {*} format    Format type name eg: SCALE_CONST_DEC_PT
 * @param {*} value     Raw value read from the device eg: 12345
 * @param {*} parameter Parameter passed into the Format parenthesis eg: SCALE_CONST_DEC_PT(-3)
 * @param {*} datatype  Data type of the parameter eg: FLOAT
 * @returns             The formatted value
 */
export const raw2readable = (format, value, parameter, datatype) => {
  let result = "";

  switch (format) {
    case "IPV4_BIG_ENDIAN()":
      result = formatIpv4BigEndian(value);
      break;
    case "IPV4_BIG_ENDIAN_U8()":
      result = formatIpv4BigEndianU8(value);
      break;
    case "MAC_ADDRESS()":
      result = formatMacAddress(value);
      break;
    case "SCALE_CONST_DEC_PT()":
      result = formatScaleConstDecPt(value, parameter, datatype);
      break;
    case "SCALE_CONST_INT()":
      result = formatScaleConstInt(value, parameter, datatype);
      break;
    case "SCALE_DCI_MULT()":
      result = formatScaleDciMult(value, parameter, datatype);
      break;
    case "SCALE_DCI_DIV()":
      result = formatScaleDciDiv(value, parameter, datatype);
      break;
    case "UNIX_TIME32()":
    case "UNIX_TIME64()":
      result = formatUnixTime(value);
      break;
    case "TIME_U8_ARRAY()":
      result = formatTimeU8Array(value);
      break;
    case "DATE_TIME_U8_ARRAY()":
      result = formatDateTimeU8Array(value);
      break;
    case "HEX_WISE_BITS()":
      result = formatHexWiseBits(value);
      break;
    case "FW_VERSION()":
      result = formatFwVersion(value);
      break;
    // CRED format is skipped as this will be masked on the HTML page
    case "CRED()":
    // HTML_Link is skipped as this will be displayed using an anchor tag in HTML page
    case "HTML_LINK()":
    //Below format types are skipped as they have been taken care on the Firmware
    case "WAIVER()":
    case "HOST_ADDRESS()":
    default:
      result = value;
  }
  return result;
};

/**
 * Format Name: IPV4_BIG_ENDIAN()
 *
 * @param {*} rawValue  eg: DD,CC,BB,AA
 * @returns             eg: AA.BB.CC.DD
 */
const formatIpv4BigEndian = (rawValue) => {
  let result = rawValue.split(",");
  result = result.reverse().join(".");
  return result;
};

/**
 * Format Name: IPV4_BIG_ENDIAN_U8()
 *
 * @param {*} rawValue  eg: 254,1,168,192
 * @returns             eg: 192.18.1.254
 */
const formatIpv4BigEndianU8 = (rawValue) => {
  let tempValue = rawValue.split(",");
  //Checking if the rawValue is having array of IP address's
  if (tempValue.length > 4) {
    tempValue = tempValue.reverse();
    let tempString = "";
    tempValue.forEach((value, index, array) => {
      if (index > 0 && index % 4 == 0) {
        tempString = tempString.substring(0, tempString.length - 1);
        tempString += "," + value + ".";
      } else {
        tempString += value + ".";
      }
    });
    tempValue = tempString.substring(0, tempString.length - 1);
    tempValue = tempValue.split(",");
    tempValue = tempValue.reverse();
  } else {
    tempValue = tempValue.reverse().join(".");
  }
  return tempValue;
};

/**
 * Format Name: MAC_ADDRESS()
 *
 * @param {*} rawValue  eg: 91,235,5,175,208,0
 * @returns             eg: 00:D0:AF:05:EB:5B
 */
const formatMacAddress = (rawValue) => {
  let tempValue = rawValue.split(",");
  tempValue = tempValue.reverse();
  tempValue.forEach((item, index, array) => {
    item = Number(item).toString(16).toUpperCase();
    array[index] = item.length == 1 ? "0" + item : item;
  });
  tempValue = tempValue.join(":");
  return tempValue;
};

/**
 * Format Name: SCALE_CONST_DEC_PT()
 *
 * @param {*} rawValue  eg: 12345
 * @param {*} parameter eg: -3
 * @param {*} datatype  eg: FLOAT
 * @returns             eg: 12.345
 */
const formatScaleConstDecPt = (rawValue, parameter, datatype) => {
  switch (datatype) {
    case "sint8":
    case "sint16":
    case "sint32":
    case "sint64":
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
      return rawValue * Math.pow(10, parameter);
    case "float":
      return HexToFloat32(rawValue).toString() * Math.pow(10, parameter);
    case "dfloat":
      return HexToFloat64(rawValue).toString() * Math.pow(10, parameter);
    default:
      return rawValue;
  }
};

/**
 * Format Name: SCALE_CONST_INT()
 *
 * @param {*} rawValue  eg: 0x4640e400 (12345)
 * @param {*} parameter eg: -5
 * @param {*} datatype  eg: FLOAT
 * @returns             eg: -61725
 */
const formatScaleConstInt = (rawValue, parameter, datatype) => {
  switch (datatype) {
    case "sint8":
    case "sint16":
    case "sint32":
    case "sint64":
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
      return rawValue * parameter;
    case "float":
      return HexToFloat32(rawValue).toString() * parameter;
    case "dfloat":
      return HexToFloat64(rawValue).toString() * parameter;
    default:
      return rawValue;
  }
};

/**
 * Format Name: SCALE_DCI_MULT()
 *
 * @param {*} rawValue  eg: 0x4640e400 (12345)
 * @param {*} parameter eg: DCI_SCALAR_DCID = 1000
 * @param {*} datatype  eg: FLOAT
 * @returns             eg: 12345000
 */
const formatScaleDciMult = (rawValue, parameter, datatype) => {
  switch (datatype) {
    case "sint8":
    case "sint16":
    case "sint32":
    case "sint64":
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
      return rawValue * parameter;
    case "float":
      return HexToFloat32(rawValue).toString() * parameter;
    case "dfloat":
      return HexToFloat64(rawValue).toString() * parameter;
    default:
      return rawValue;
  }
};

/**
 * Format Name: SCALE_DCI_DIV()
 *
 * @param {*} rawValue  eg: 0x4640e400 (12345)
 * @param {*} parameter eg: DCI_SCALAR_DCID = 1000
 * @param {*} datatype  eg: FLOAT
 * @returns             eg: 12.345
 */
const formatScaleDciDiv = (rawValue, parameter, datatype) => {
  switch (datatype) {
    case "sint8":
    case "sint16":
    case "sint32":
    case "sint64":
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
      return rawValue / parameter;
    case "float":
      return HexToFloat32(rawValue).toString() / parameter;
    case "dfloat":
      return HexToFloat64(rawValue).toString() / parameter;
    default:
      return rawValue;
  }
};

/**
 * Format Name: UNIX_TIME32() and UNIX_TIME64()
 *
 * @param {*} rawValue  eg: 1491462125
 * @returns             eg: 1/1/2000, 8:04:56 AM
 */
const formatUnixTime = (rawValue) => {
  let myDate = new Date(rawValue * 1000);
  return myDate.toLocaleString();
};

/**
 * Format Name: TIME_U8_ARRAY()
 *
 * @param {*} rawValue  eg: HH, mm, ss
 * @returns             eg: HH:mm:ss
 */
const formatTimeU8Array = (rawValue) => {
  let result = rawValue.replace(/,/g, ":");
  return result;
};

/**
 * Format Name: DATE_TIME_U8_ARRAY()
 *
 * @param {*} rawValue  eg: YY, MM, DD, HH, mm, ss
 * @returns             eg: MM/DD/YY - HH:mm:ss
 */
const formatDateTimeU8Array = (rawValue) => {
  let result = rawValue.split(",");
  result = result[1] + "/" + result[2] + "/" + result[0] + " - " + result[3] + ":" + result[4] + ":" + result[5];
  return result;
};

/**
 * Format Name: HEX_WISE_BITS()
 *
 * @param {*} rawValue  eg: 0b01010101, 0b11111111
 * @returns             eg: 0x55, 0xFF
 */
const formatHexWiseBits = (rawValue) => {
  let result = rawValue.split(",");
  result.forEach((value, index, array) => {
    array[index] = parseInt(value, 2).toString(16).toUpperCase();
  });
  return result.join(",");
};

/**
 * Format Name: FW_VERSION()
 *
 * @param {*} rawValue  eg: 65793
 * @returns             eg: 1.1.1
 */
const formatFwVersion = (rawValue) => {
  let tempRawValue = rawValue;
  if ((tempRawValue.substring(0, 2) == "0x") | (tempRawValue.substring(0, 2) == "0X")) {
    tempRawValue = parseInt(tempRawValue, 16).toString(10);
  }
  let dec2bin = Number(tempRawValue).toString(2);
  let major = dec2bin.slice(-8) | 0;
  let minor = dec2bin.slice(-16, -8) | 0;
  let build = dec2bin.slice(-32, -16) | 0;
  let result = parseInt(major, 2) + "." + parseInt(minor, 2) + "." + parseInt(build, 2);
  return result;
};

export default raw2readable;
