const { chromium } = require('playwright');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../www.deegolabs.com/.env') });

const PORT = process.env.EXTERNAL_PORT || '21001';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'devops@gupsa.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rlacjawl1@';
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = __dirname;

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500 // 동작을 천천히 실행하여 확인 가능
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`WordPress 사이트 접속 중... (포트: ${PORT})`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // 페이지 제목 확인
    const title = await page.title();
    console.log(`페이지 제목: ${title}`);

    // 스크린샷 저장
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'homepage.png'),
      fullPage: true
    });
    console.log('홈페이지 스크린샷 저장 완료');

    // 관리자 페이지 접속
    console.log('관리자 페이지 접속 중...');
    await page.goto(`${BASE_URL}/wp-admin`, { waitUntil: 'networkidle' });

    // 로그인 폼이 있는지 확인
    const loginForm = await page.$('#loginform');
    if (loginForm) {
      console.log('로그인 폼 발견');

      // 로그인 시도
      await page.fill('#user_login', ADMIN_EMAIL);
      await page.fill('#user_pass', ADMIN_PASSWORD);

      // 로그인 스크린샷
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'login-before.png')
      });
      console.log('로그인 전 스크린샷 저장 완료');

      await page.click('#wp-submit');
      console.log('로그인 버튼 클릭');

      // 로그인 완료 대기
      await page.waitForTimeout(3000);

      // 로그인 후 URL 확인
      const currentUrl = page.url();
      console.log(`현재 URL: ${currentUrl}`);

      // 로그인 성공 여부 확인
      if (currentUrl.includes('wp-admin') && !currentUrl.includes('wp-login')) {
        console.log('✓ 로그인 성공!');

        // 대시보드 스크린샷
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'dashboard.png'),
          fullPage: true
        });
        console.log('대시보드 스크린샷 저장 완료');
      } else {
        console.log('✗ 로그인 실패');
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'login-failed.png')
        });
      }
    } else {
      console.log('이미 로그인되어 있거나 로그인 폼을 찾을 수 없습니다');
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'admin-page.png'),
        fullPage: true
      });
    }

    console.log('\n=== 테스트 완료 ===');
    console.log(`접속 URL: ${BASE_URL}`);
    console.log(`관리자 이메일: ${ADMIN_EMAIL}`);
    console.log(`관리자 비밀번호: ${ADMIN_PASSWORD}`);

  } catch (error) {
    console.error('에러 발생:', error);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'error.png')
    });
  } finally {
    // 브라우저는 수동으로 닫을 수 있도록 자동으로 닫지 않음
    console.log('\n브라우저를 수동으로 닫아주세요.');
    // await browser.close();
  }
})();
