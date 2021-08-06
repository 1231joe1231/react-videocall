const adjs = [
  "可爱",
  "粉红",
  "开心",
  "勤奋",
  "快乐",
  "幸福",
  "深蓝",
  "浅蓝",
  "呆呆",
  "傻傻",
  "没头脑",
  "不高兴",
  "性感",
];

const nouns = [
  "猪猪",
  "狗狗",
  "小鸟",
  "兔兔",
  "小朋友",
  "小马",
  "便便",
  "丹丹",
];

module.exports = () => {
  const adj = adjs[Math.floor(Math.random() * adjs.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const MIN = 10;
  const MAX = 99;
  const num = Math.floor(Math.random() * (MAX + 1 - MIN)) + MIN;

  return `${adj}的${noun}${num}`;
};
