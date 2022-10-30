import { randomFillSync } from 'node:crypto';

const EPOCH = 1639872000000;
let INCREMENT = 0;

export const generate = async(id: string) => {
    const first = Buffer.from(id).toString('base64');
    const second = Buffer.from(timestampToSnowflake()).toString('base64');
    const third = generateThird();
    return first + '.' + second + '.' + third;
};

export const generateThird = (length = 27, list = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') => 
    Array.from(randomFillSync(new Uint32Array(length)))
        .map((x) => list[x % list.length])
        .join('');

const binaryToId = (num) => {
    let dec = '';
  
    while (num.length > 50) {
      const high = parseInt(num.slice(0, -32), 2);
      const low = parseInt((high % 10).toString(2) + num.slice(-32), 2);
  
      dec = (low % 10).toString() + dec;
      num =
        Math.floor(high / 10).toString(2) +
        Math.floor(low / 10)
          .toString(2)
          .padStart(32, '0');
    }
  
    num = parseInt(num, 2);
    while (num > 0) {
      dec = (num % 10).toString() + dec;
      num = Math.floor(num / 10);
    }
  
    return dec;
};

export const timestampToSnowflake = (timestamp = Date.now()) => {
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
      throw new TypeError(
        `"timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`,
      );
    }

    if (INCREMENT >= 4095) INCREMENT = 0;
    const BINARY = `${(timestamp - EPOCH).toString(2).padStart(42, '0')}0000100000${(INCREMENT++)
      .toString(2)
      .padStart(12, '0')}`;
  
    return binaryToId(BINARY);
};

export const snowflakeToTimestamp = (snowflake) => {
  return new Date(snowflake / 4194304 + EPOCH).getTime();
};