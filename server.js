const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, "public")));

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// 사용자 데이터 로드
let users = [];
try {
  const data = fs.readFileSync("users.json", "utf-8");
  users = JSON.parse(data);
} catch (err) {
  console.log("users.json 불러오기 실패, 빈 배열로 시작");
  users = [];
}

// 회원가입 API
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log("✅ /signup 요청 도착:", username);

  const exists = users.find(user => user.username === username);
  if (exists) {
    console.log("❗중복 아이디:", username);
    return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
  }

  users.push({ username, password });

  try {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
    console.log("✅ 저장 완료! users.json:", users);
  } catch (err) {
    console.error("❌ 저장 실패:", err.message);
  }

  res.json({ message: "회원가입 성공!" });
});

// 로그인 API
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const found = users.find(user => user.username === username && user.password === password);
  if (!found) {
    return res.status(401).json({ message: "아이디 또는 비밀번호가 틀렸습니다." });
  }
  res.json({ message: "로그인 성공!" });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
