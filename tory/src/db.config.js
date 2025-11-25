import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.DB_PORT) {
  throw new Error("DB 환경변수가 설정되지 않았습니다. .env 파일 확인!.");
}

export const prisma = new PrismaClient();



export const pool = mysql.createPool({
  host: process.env.DB_HOST, // mysql의 hostname
  user: process.env.DB_USER, // user 이름
  port: process.env.DB_PORT, // 포트 번호
  database: process.env.DB_NAME, // 데이터베이스 이름
  password: process.env.DB_PASSWORD, // 비밀번호
  waitForConnections: true,
  connectionLimit: 10, // 몇 개의 커넥션을 가지게끔 할 것인지
  queueLimit: 0, // getConnection에서 오류가 발생하기 전에 Pool에 대기할 요청의 개수 한도
});