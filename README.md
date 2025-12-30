# 🏦 DYMF (DY-Microfinance Customer Management) - Frontend

마이크로파이낸스(소액금융) 관리 플랫폼의 **프론트엔드 웹 애플리케이션**입니다.
고객 관리, 대출 관리, 고정자산 관리, HR, 상환 등 종합적인 금융 운영을 지원합니다.

**배포 URL**: [dymf-front.vercel.app](https://dymf-front.vercel.app)

---

## 📋 목차
- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [팀원](#팀원)

---

## 📌 프로젝트 개요

**DYMF(DY-Microfinance Customer Management)** 는 마이크로파이낸스 조직의 운영을 디지털화하는 통합 관리 시스템입니다.
이 저장소는 **백엔드(dymf-back)와 통신하는 클라이언트 사이드**를 담당합니다.

### 핵심 특징
- ✅ **Next.js 기반 풀스택 React 애플리케이션**
- ✅ **API 라우트 기반의 백엔드 통신** (RESTful)
- ✅ **사용자 인증 & 권한 관리** (User Role 기반)
- ✅ **테마 지원** (라이트/다크 모드)
- ✅ **반응형 UI** (Radix UI + Tailwind CSS)
- ✅ **타입 안전성** (TypeScript)

---

## 🎯 주요 기능

### 1️⃣ **홈 (Home)**
- 대시보드 개요 페이지
- 주요 통계 및 요약 정보

### 2️⃣ **고객 관리 (Customer)**
- 고객 정보 조회 및 검색
- 고객 등록
- 고객 상세 정보 조회

### 3️⃣ **대출 관리 (Loan)**
- **검색**: CP 번호 기반 대출 정보 검색
- **조회**: 대출 상세 정보 및 탭 기반 상세 보기
- **대출 담당자 지정** (Assign Loan Officer)
- **대출 계산기**: 대출액, 이율, 기간 기반 상환액 계산

### 4️⃣ **고객 보증인 (Guarantor)**
- 보증인 정보 조회 및 관리

### 5️⃣ **고정자산 관리 (Fixed Assets)**
- 고정자산 등록 및 삭제
- 자산 현황 조회

### 6️⃣ **상환 관리 (Repayment)**
- 상환 일정 조회
- 상환 현황 및 연체 추적

### 7️⃣ **체크포인트 관리 (CP - Checkpoint)**
- CP 번호 검색
- 고객 등록 완료도 추적

### 8️⃣ **인사 관리 (HR)**
- 직원 정보 조회
- 역할별 사용자 관리

### 9️⃣ **보고서 (Report)**
- 다양한 리포트 생성 및 조회

### 🔟 **사용자 관리 (User)**
- 사용자 등록
- 사용자 삭제

---

## ⚒️ 기술 스택

| 분류 | 기술 |
|------|------|
| **Runtime** | Node.js |
| **언어** | TypeScript |
| **프레임워크** | Next.js 15.3.4 |
| **라이브러리** | React 19.0.0 |
| **UI 컴포넌트** | Radix UI (Dialog, Tabs, Dropdown, Alert, etc.) |
| **스타일링** | Tailwind CSS 3.4.1 + CVA (Class Variance Authority) |
| **아이콘** | Lucide React |
| **HTTP 클라이언트** | Axios 1.7.9 |
| **토큰 관리** | JWT Decode 4.0.0 |
| **날짜/시간** | date-fns 4.1.0 |
| **알림/토스트** | Sonner 1.7.4 |
| **테마** | next-themes 0.4.4 |
| **이미지 처리** | Sharp 0.33.5 |
| **애니메이션** | tailwindcss-animate |
| **개발 도구** | ESLint, TypeScript, PostCSS |

---

## 📂 프로젝트 구조

```
src/
├── app/                           # Next.js 앱 라우터
│   ├── (with-app-sidebar)/       # 인증된 사용자 레이아웃
│   │   ├── home/                  # 홈 페이지
│   │   ├── cp/                    # 보충 자료 요청 (Checkpoint)
│   │   ├── search/                # 검색 페이지
│   │   ├── calculator/            # 대출 계산기
│   │   ├── fixed-assets/          # 고정자산 관리
│   │   ├── hr/                    # 인사 관리
│   │   ├── overdue/               # 연체 관리
│   │   ├── registration/          # 고객 등록
│   │   ├── repayment/             # 상환 관리
│   │   ├── report/                # 보고서
│   │   ├── user/                  # 사용자 관리
│   │   └── layout.tsx             # 사이드바 레이아웃
│   ├── login/                     # 로그인 페이지
│   ├── api/                       # API 라우트 (백엔드 프록시)
│   │   ├── auth/                  # 인증 관련
│   │   ├── getCustomers/          # 고객 조회
│   │   ├── getLoans/              # 대출 조회
│   │   ├── getCpNumbers/          # CP 번호 검색
│   │   ├── getFixedAssets/        # 고정자산 조회
│   │   ├── getGuarantors/         # 보증인 조회
│   │   ├── getLoanOfficers/       # 대출 담당자 조회
│   │   ├── assignLoanOfficer/     # 대출 담당자 지정
│   │   ├── deleteUser/            # 사용자 삭제
│   │   ├── deleteFixedAsset/      # 고정자산 삭제
│   │   └── ... (기타 API 엔드포인트)
│   ├── layout.tsx                 # 루트 레이아웃
│   └── page.tsx                   # 루트 페이지
├── components/                    # 재사용 가능한 컴포넌트
│   ├── ui/                        # Radix UI 기반 컴포넌트
│   │   ├── tabs.tsx               # 탭 컴포넌트
│   │   ├── dialog.tsx             # 다이얼로그
│   │   ├── button.tsx             # 버튼
│   │   └── ... (기타 UI 컴포넌트)
│   ├── pop-ups/                   # 모달/팝업 컴포넌트
│   ├── tabs/                      # 페이지별 탭 컴포넌트
│   ├── app-sidebar.tsx            # 애플리케이션 사이드바
│   ├── nav-*.tsx                  # 네비게이션 컴포넌트
│   └── theme-provider.tsx         # 테마 제공자
├── context/                       # React Context (상태 관리)
│   └── UserProvider.tsx           # 사용자 정보 및 권한 관리
├── hooks/                         # 커스텀 React Hook
├── util/                          # 유틸리티 함수
├── middleware.ts                  # Next.js 미들웨어 (요청 처리)
├── types.ts                       # TypeScript 타입 정의
└── eslint.config.mjs              # ESLint 설정
```

---

## 🚀 시작하기

### 설치

```bash
# 저장소 클론
git clone https://github.com/DY-Microfinance-Customer-Management/dymf-front.git
cd dymf-front

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

- 브라우저에서 [http://localhost:3001](http://localhost:3001) 접속

### 빌드

```bash
npm run build
npm start
```

### 설정

백엔드 API 엔드포인트는 `src/app/api/*` 폴더의 라우트 핸들러에서 관리됩니다.
환경 변수 설정이 필요한 경우 `.env.local` 파일을 생성하여 구성합니다.

---

## 🔐 인증 & 권한

- **JWT 기반 토큰 인증**
- **Role 기반 접근 제어** (UserProvider.tsx 에서 관리)
- **로그인 페이지**: `/login`
- **보호된 라우트**: `(with-app-sidebar)` 폴더 내 모든 페이지

---

## 🎨 UI/UX

- **Radix UI**: 접근성이 높은 헤드리스 컴포넌트
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Dark Mode**: next-themes로 라이트/다크 모드 지원
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 호환

---

## 👨‍💻 팀원

| 역할 | 이름 |
|------|------|
| Backend | 모진영 |
| Backend | 박훈일 |
| Frontend | 박건우 |

---

## 📝 Commit Convention

```
[타입]: 제목

본문 (선택사항)
```

**타입 종류**:
- `Feat`: 새로운 기능
- `Fix`: 버그 수정
- `Refactor`: 코드 리팩토링
- `Debug`: 디버깅
- `Test`: 테스트 코드
- `Style`: 스타일 변경
- `Chore`: 빌드, 의존성 등

**예시**:
```
Feat: 대출 검색 기능 추가
Fix: 대출 상세 탭 표시 오류 수정
Refactor: 사이드바 UI 개선
```

---

## 🗒️ Code Convention

### 파일명
- **컴포넌트**: PascalCase (예: `UserProfile.tsx`)
- **유틸리티/훅**: camelCase (예: `useUserContext.ts`)
- **페이지**: kebab-case (예: `loan-details.tsx`)

### 변수/함수명
- camelCase 사용
- 명확한 이름 (예: `getLoanDetails()`)

### 타입 정의
- `types.ts`에 모든 타입 정의
- 인터페이스는 `I` 접두사 생략

### 컴포넌트 구조
```typescript
// 임포트
import { useState } from 'react';

// 타입 정의
interface Props {
  title: string;
}

// 컴포넌트
export default function Component({ title }: Props) {
  // 상태
  const [state, setState] = useState('');

  // 이펙트 및 로직

  // 렌더
  return <div>{title}</div>;
}
```

---

## 📄 라이선스

MIT License - 자유로운 사용, 수정, 배포 가능

---

## 📞 문의

이 프로젝트에 대한 문의사항은 이슈를 통해 주시기 바랍니다.
