import { Float32ToHex, Float64ToHex } from "./helper_functions";

/**
 * JavaScript file to maintain the Format Handlers
 * to convert User edited value on UI to Raw value which would be sent to the device
 *
 * @param {*} format    Format type name eg: SCALE_CONST_DEC_PT
 * @param {*} value     User edited value on UI eg: 12.345
 * @param {*} parameter Parameter passed into the Format parenthesis eg: SCALE_CONST_DEC_PT(-3)
 * @param {*} datatype  Data type of the parameter eg: FLOAT
 * @returns             The formatted value
 */
export const readable2raw = (format, value, parameter, datatype) => {
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
    case "SCALE_DCI_MULT()":
      result = formatScaleDciMult(value, parameter, datatype);
      break;
    case "SCALE_DCI_DIV()":
      result = formatScaleDciDiv(value, parameter, datatype);
      break;
    case "SCALE_CONST_DEC_PT()":
    case "SCALE_CONST_INT()":
      result = formatFloatToHex(value, datatype);
      break;
    case "HEX_WISE_BITS()":
      result = formatHexWiseBits(value);
      break;
    // CRED format is skipped as this will be masked on the HTML page
    case "CRED()":
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
 * @param {*} readableValue   eg: AA.BB.CC.DD
 * @returns                   eg: DD,CC,BB,AA
 */
const formatIpv4BigEndian = (readableValue) => {
  let result = readableValue.split(".");
  result = result.reverse().join(",");
  return result;
};

/**
 * Format Name: IPV4_BIG_ENDIAN_U8()
 *
 * @param {*} readableValue   eg: 192.18.1.254
 * @returns                   eg: 254,1,168,192
 */
const formatIpv4BigEndianU8 = (readableValue) => {
  let tempValue = readableValue.split(",");
  //Checking if the readableValue is having array of IP address's
  if (tempValue.length > 1) {
    tempValue.forEach((val, index, array) => {
      array[index] = val.split(".").reverse().join(",");
    });
    tempValue = tempValue.join(",");
  } else {
    tempValue = readableValue.split(".").reverse().join(",");
  }
  return tempValue;
};

/**
 * Format Name: MAC_ADDRESS()
 *
 * @param {*} readableValue eg: 00:D0:AF:05:EB:5B
 * @returns                 eg: 91,235,5,175,208,0
 */
const formatMacAddress = (readableValue) => {
  let tempValue = readableValue.split(":");
  tempValue = tempValue.reverse();
  tempValue.forEach((item, index, array) => {
    array[index] = parseInt(item, 16);
  });
  tempValue = tempValue.join(",");
  return tempValue;
};

/**
 * Format Name: SCALE_CONST_DEC_PT(), SCALE_CONST_INT(), SCALE_DCI_MULT() and SCALE_DCI_DIV()
 *
 * @param {*} readableValue eg: 12.345
 * @param {*} datatype      eg: FLOAT
 * @returns                 eg: 0x4145851f
 */
const formatFloatToHex = (readableValue, datatype) => {
  if (datatype == "float") {
    return "0x" + Float32ToHex(readableValue);
  } else if (datatype == "dfloat") {
    return "0x" + Float64ToHex(readableValue);
  } else {
    return readableValue;
  }
};

/**
 * Format Name: HEX_WISE_BITS()
 *
 * @param {*} readableValue eg: 0x55, 0xFF
 * @returns                 eg: 0b01010101, 0b11111111
 */
const formatHexWiseBits = (readableValue) => {
  let result = readableValue.split(",");
  result.forEach((value, index, array) => {
    array[index] = parseInt(value.toString(), 16).toString(2).padStart(8, "0");
  });
  return result.join(",");
};

/**
 * Format Name: SCALE_DCI_MULT()
 *
 * @param {*} readableValue eg: 24
 * @param {*} parameter     eg: 2
 * @param {*} datatype      eg: UINT8
 * @returns                 eg: 12
 */
const formatScaleDciMult = (readableValue, parameter, datatype) => {
  switch (datatype) {
    case "sint8":
    case "sint16":
    case "sint32":
    case "sint64":
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
      return readableValue / parameter;
    case "float":
      return "0x" + Float32ToHex(readableValue / parameter);
    case "dfloat":
      return "0x" + Float64ToHex(readableValue / parameter);
    default:
      return readableValue;
  }
};

/**
 * Format Name: SCALE_DCI_DIV()
 *
 * @param {*} readableValue eg: 10
 * @param {*} parameter     eg: 10
 * @param {*} datatype      eg: UINT8
 * @returns                 eg: 100
 */
const formatScaleDciDiv = (readableValue, parameter, datatype) => {
  switch (datatype) {
    case "sint8":
    case "sint16":
    case "sint32":
    case "sint64":
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
      return readableValue * parameter;
    case "float":
      return "0x" + Float32ToHex(readableValue * parameter);
    case "dfloat":
      return "0x" + Float64ToHex(readableValue * parameter);
    default:
      return readableValue;
  }
};

export default readable2raw;
