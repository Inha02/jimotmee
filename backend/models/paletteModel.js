const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  key: { type: String, required: true }, // 색상 키
  title: { type: String, required: true }, // 색상 제목
  color: { type: String, required: true }, // 색상 값
});

const paletteSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // 사용자 ID (고유)
  colors: [colorSchema], // 여러 색상 데이터를 배열로 저장
});

module.exports = mongoose.model('Palette', paletteSchema);