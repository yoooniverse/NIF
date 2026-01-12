# Clerk 세션 쿠키 수명 설정 가이드

## 개요
Clerk의 세션 쿠키 수명을 1-2일로 제한하여 보안을 강화합니다.

## Clerk Dashboard 설정 방법

### 1. Clerk Dashboard 접속
1. [Clerk Dashboard](https://dashboard.clerk.com/)에 로그인합니다.
2. 해당 프로젝트를 선택합니다.

### 2. 세션 설정 변경
1. 왼쪽 사이드바에서 **Settings** → **Sessions** 메뉴로 이동합니다.
2. **Session lifetime** 섹션을 찾습니다.
3. 다음 설정을 변경합니다:

#### Inactive session lifetime (비활성 세션 수명)
- **권장값**: 1일 (24시간) 또는 2일 (48시간)
- 사용자가 활동하지 않으면 이 시간 후 자동 로그아웃됩니다.

#### Maximum session lifetime (최대 세션 수명)
- **권장값**: 2일 (48시간)
- 사용자 활동과 관계없이 이 시간 후 무조건 로그아웃됩니다.

### 3. 설정 예시
```
Inactive session lifetime: 1 day
Maximum session lifetime: 2 days
```

이렇게 설정하면:
- 사용자가 1일 동안 활동하지 않으면 자동 로그아웃
- 최대 2일 후에는 활동 여부와 관계없이 재로그인 필요

### 4. 저장
설정을 변경한 후 **Save** 버튼을 클릭하여 저장합니다.

## 코드 레벨 설정 (보조)

`middleware.ts` 파일에 다음과 같은 설정이 추가되었습니다:

```typescript
export default clerkMiddleware(
  async (auth, req) => {
    // ... 미들웨어 로직
  },
  {
    clockSkewInMs: 60000, // 1분의 시계 오차 허용
  }
);
```

**참고**: 코드 레벨에서는 세션 수명을 직접 제어할 수 없으며, Clerk Dashboard 설정이 우선 적용됩니다.

## 환경 변수 (선택사항)

`.env.local` 파일에 다음 환경 변수를 추가할 수 있습니다:

```env
# Clerk 세션 설정
CLERK_SESSION_TOKEN_TEMPLATE=default
```

## 검증 방법

1. 로그인 후 브라우저 개발자 도구를 엽니다 (F12)
2. **Application** → **Cookies** 탭으로 이동합니다
3. `__session` 또는 `__clerk_db_jwt` 쿠키를 확인합니다
4. **Expires** 값이 1-2일 이내로 설정되어 있는지 확인합니다

## 주의사항

- Dashboard 설정 변경 후 기존 세션은 즉시 영향을 받지 않을 수 있습니다
- 새로운 로그인부터 변경된 설정이 적용됩니다
- 개발 환경과 프로덕션 환경의 설정을 별도로 관리할 수 있습니다

## 추가 보안 권장사항

1. **Multi-factor authentication (MFA)** 활성화
2. **Session token rotation** 활성화
3. **Suspicious activity detection** 활성화
4. **IP-based restrictions** 고려 (필요시)

## 참고 문서

- [Clerk Session Management](https://clerk.com/docs/authentication/configuration/session-options)
- [Clerk Security Best Practices](https://clerk.com/docs/security/overview)
