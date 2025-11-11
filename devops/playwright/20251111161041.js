const { chromium } = require('playwright');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../www.deegolabs.com/.env') });

const PORT = process.env.EXTERNAL_PORT || '21001';
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
    console.log(`URL: ${BASE_URL}`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // 페이지 제목 확인
    const title = await page.title();
    console.log(`페이지 제목: ${title}`);

    // 로고 이미지 요소 찾기
    console.log('로고 이미지 검사 중...');
    const logoImages = await page.$$('img[class*="h-8"]');

    if (logoImages.length > 0) {
      console.log(`✓ h-8 클래스를 가진 이미지 ${logoImages.length}개 발견`);

      for (let i = 0; i < logoImages.length; i++) {
        const img = logoImages[i];
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        const className = await img.getAttribute('class');

        console.log(`이미지 ${i + 1}:`);
        console.log(`  - src: ${src}`);
        console.log(`  - alt: ${alt}`);
        console.log(`  - class: ${className}`);

        // 이미지 요소 하이라이트
        await img.evaluate(el => {
          el.style.border = '3px solid red';
          el.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.8)';
        });
      }

      // h-8 클래스 확인을 위한 스타일 정보 가져오기
      const logoElement = logoImages[0];
      const computedHeight = await logoElement.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          height: styles.height,
          maxHeight: styles.maxHeight,
          minHeight: styles.minHeight,
          className: el.className
        };
      });

      console.log('로고 스타일 정보:');
      console.log(`  - height: ${computedHeight.height}`);
      console.log(`  - max-height: ${computedHeight.maxHeight}`);
      console.log(`  - min-height: ${computedHeight.minHeight}`);
      console.log(`  - class: ${computedHeight.className}`);

    } else {
      console.log('✗ h-8 클래스를 가진 이미지를 찾을 수 없음');

      // 모든 이미지 요소 확인
      const allImages = await page.$$('img');
      console.log(`전체 이미지 ${allImages.length}개 발견:`);

      for (let i = 0; i < allImages.length; i++) {
        const img = allImages[i];
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        const className = await img.getAttribute('class');

        console.log(`이미지 ${i + 1}:`);
        console.log(`  - src: ${src}`);
        console.log(`  - alt: ${alt}`);
        console.log(`  - class: ${className}`);
      }
    }

    // 전체 페이지 스크린샷 저장
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'h8-check-fullpage.png'),
      fullPage: true
    });
    console.log('전체 페이지 스크린샷 저장 완료');

    // 헤더 영역 스크린샷 저장
    const header = await page.$('header, .header, nav, .navbar, .navigation');
    if (header) {
      await header.screenshot({
        path: path.join(SCREENSHOT_DIR, 'h8-check-header.png')
      });
      console.log('헤더 영역 스크린샷 저장 완료');
    }

    // Tailwind CSS 확인
    console.log('\nTailwind CSS 확인 중...');
    const tailwindCheck = await page.evaluate(() => {
      // h-8 클래스가 정의되어 있는지 확인
      const testElement = document.createElement('div');
      testElement.className = 'h-8';
      document.body.appendChild(testElement);

      const styles = window.getComputedStyle(testElement);
      const height = styles.height;

      document.body.removeChild(testElement);

      return {
        height: height,
        isTailwindLoaded: height === '32px' || height === '2rem'
      };
    });

    console.log('Tailwind CSS 상태:');
    console.log(`  - h-8 클래스 높이: ${tailwindCheck.height}`);
    console.log(`  - Tailwind 로드 상태: ${tailwindCheck.isTailwindLoaded ? '✓ 정상' : '✗ 문제'}`);

    console.log('\n=== h-8 클래스 검사 완료 ===');
    console.log(`접속 URL: ${BASE_URL}`);
    console.log('스크린샷이 저장되었습니다:');
    console.log('  - h8-check-fullpage.png (전체 페이지)');
    console.log('  - h8-check-header.png (헤더 영역)');

  } catch (error) {
    console.error('에러 발생:', error);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'h8-check-error.png')
    });
  } finally {
    // 브라우저는 수동으로 닫을 수 있도록 자동으로 닫지 않음
    console.log('\n브라우저를 수동으로 닫아주세요.');
    // await browser.close();
  }
})();