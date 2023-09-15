/**
 * 生成 8 位随机数字。
 *
 * @return {string} 8位随机数字
 */
export function uniqueId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4();
}

/**
 * 基于时间戳的 uuid
 *
 * @returns uniqueId
 */
export const uuid = () => {
  return (+new Date()).toString(36);
};

// 参考 https://github.com/streamich/v4-uuid
const createStr = () =>
  ('00000000000000000' + (Math.random() * 0xffffffffffffffff).toString(16)).slice(-16);

export const uuidv4 = () => {
  const a = createStr();
  const b = createStr();
  return (
    a.slice(0, 8) +
    '-' +
    a.slice(8, 12) +
    '-4' +
    a.slice(13) +
    '-a' +
    b.slice(1, 4) +
    '-' +
    b.slice(4)
  );
};
