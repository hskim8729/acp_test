# Tapp 시스템 for 아시아나IDT
 

## 1. 프로젝트

- **tapp**
- web frontend client (vue.js) - port : 3000



## 2. 프로젝트 핵심 모듈 구성

- node.js v.16.15.1

- vue.js 3.0 + Vite + Pinia

- Element-plus
  
  

## 3. 대상 Web Browser

**Google Chrome 최신 버전**
  
  

## 4. 개발환경 IDE

- Visual Studio Code

- 최신 버전 사용

  

### 필수 Extension

- Vue Language Features (Volar)

- Vue VSCode Snippets

- JavaScript (ES6) code snippets

- IntelliCode

- ESLint

- Prettier

- HTML CSS Support

- CSS Peek
  

### 선택 Extension
- Better Comments
  

## 5. 프로젝트 모듈 설치
프로젝트 모듈은 반드시 npm으로 설치

```
npm install
```
  

## 6. 프로젝트 실행

```
npm run dev
```

  
## 7. 프로젝트 빌드

```
// 개발기
npm run build:dev

// 운영기
npm run build:prod
```
  

## 8. 프로젝트 배포
dist 폴더를 nginX의 배포 위치로 이동

## 9. 프로젝트 샘플 URL
- 기본 도메인 : http://localhost:4000
- 기능 URI
  | 기능                      | URI                        | 비고 |
  | ------------------------- | -------------------------- | ---- |
  | Login                     | /login                     |      |
  | LogOut                    | /logout                    |      |
  | ag-grid SAMPLE            | /ag-grid                   |      |
