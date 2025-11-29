// ==========================
//  BASIC SETTINGS
// ==========================
const DEMO_PASSWORD = "RENTAL2025";

// 0.png ~ 24.png  총 25페이지라고 가정
const TOTAL_PAGES = 24;   // 0,1,2,...,24
let currentLeftPage = 0;  // 항상 "왼쪽" 페이지 번호

// 실제 메일 발송 대신 콘솔에만 찍는 더미 함수
async function sendEmailToBen(subject, message) {
  console.log("📨 Sending email to ben@opencbct.com...");
  console.log("SUBJECT:", subject);
  console.log("MESSAGE:", message);
  return true;
}

// ==========================
//  PAGE VIEWER LOGIC (0.png부터)
// ==========================
function createBookViewer() {
  const leftImg  = document.getElementById("pageImgLeft");
  const rightImg = document.getElementById("pageImgRight");
  const btnPrev  = document.getElementById("pagePrev");
  const btnNext  = document.getElementById("pageNext");

  if (!leftImg || !rightImg || !btnPrev || !btnNext) return;

  // 현재 currentLeftPage 값을 기준으로 이미지 교체
  function renderPages() {
    // 왼쪽
    leftImg.src = `../css/book/${currentLeftPage}.png`;
    leftImg.alt = `Page ${currentLeftPage}`;

    // 오른쪽 페이지 번호
    const rightPage = currentLeftPage + 1;

    if (rightPage < TOTAL_PAGES) {
      rightImg.src = `../css/book/${rightPage}.png`;
      rightImg.alt = `Page ${rightPage}`;
      rightImg.style.visibility = "visible";
    } else {
      // 마지막이 홀수 페이지일 경우 오른쪽은 숨김
      rightImg.style.visibility = "hidden";
    }

    // 버튼 활성/비활성
    btnPrev.disabled = currentLeftPage <= 0;
    btnNext.disabled = currentLeftPage + 2 >= TOTAL_PAGES;
  }

  // 처음 렌더링 (0,1 페이지)
  renderPages();

  // ← 버튼
  btnPrev.addEventListener("click", () => {
    if (currentLeftPage >= 2) {
      currentLeftPage -= 2;
      renderPages();
    }
  });

  // → 버튼
  btnNext.addEventListener("click", () => {
    if (currentLeftPage + 2 < TOTAL_PAGES) {
      currentLeftPage += 2;
      renderPages();
    }
  });
}

// ==========================
//  MAIN: GATE + FORMS
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const accessGate  = document.getElementById("accessGate");
  const siteContent = document.getElementById("siteContent");

  const requestForm   = document.getElementById("requestForm");
  const requestEmail  = document.getElementById("requestEmail");
  const requestPhone  = document.getElementById("requestPhone");
  const requestHelper = document.getElementById("requestHelper");

  const passwordForm  = document.getElementById("passwordForm");
  const passwordInput = document.getElementById("passwordInput");
  const passwordError = document.getElementById("passwordError");

  const investorMessageForm = document.getElementById("investorMessageForm");
  const investorMessage     = document.getElementById("investorMessage");
  const sendBtn             = document.querySelector(".send-btn");
  const sentConfirm         = document.getElementById("sentConfirm");

  // 1) PASSWORD REQUEST (email/phone 수집)
  if (requestForm) {
    requestForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = requestEmail.value.trim();
      const phone = requestPhone.value.trim();

      if (!email && !phone) {
        requestHelper.textContent =
          "Please enter either email or mobile number.";
        requestHelper.style.color = "#ff5c7a";
        return;
      }

      const msg = `
📌 PASSWORD REQUEST
Email: ${email || "none"}
Phone: ${phone || "none"}
Time: ${new Date().toLocaleString()}
`;

      await sendEmailToBen("PASSWORD REQUEST", msg);

      requestHelper.textContent =
        "If authorized, your password will be sent to your email/phone.";
      requestHelper.style.color = "#9fb4e8";

      if (passwordInput) passwordInput.focus();
    });
  }

  // 2) PASSWORD CHECK → GATE OPEN + BOOK VIEWER INIT
  if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      passwordError.textContent = "";

      const pw = passwordInput.value.trim();

      if (pw === DEMO_PASSWORD) {
        accessGate.classList.add("hidden");
        siteContent.classList.remove("hidden");

        // ✅ 로그인 성공 후 책 뷰어 시작 (0.png,1.png)
        createBookViewer();
      } else {
        passwordError.textContent = "Invalid password.";
      }
    });
  }

  // 3) INVESTOR MESSAGE
  if (investorMessageForm) {
    investorMessageForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const msg = investorMessage.value.trim();
      if (!msg) {
        investorMessage.focus();
        return;
      }

      const emailMessage = `
📌 INVESTOR MESSAGE
-------------------------
${msg}
-------------------------
Sent: ${new Date().toLocaleString()}
`;

      await sendEmailToBen("INVESTOR MESSAGE", emailMessage);

      sendBtn.classList.add("sent");
      sentConfirm.classList.add("visible");

      setTimeout(() => {
        investorMessage.value = "";
      }, 800);

      setTimeout(() => {
        sendBtn.classList.remove("sent");
      }, 3000);
    });
  }
});
