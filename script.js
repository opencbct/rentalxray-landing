// ===========================
// BASIC SETTINGS
// ===========================
const DEMO_PASSWORD = "RENTAL2025";
const TOTAL_PAGES = 24; // ../css/book/1.png ~ 24.png

// 실제 이메일 발송 대신 콘솔만 찍는 더미 함수
async function sendEmailToBen(subject, message) {
  console.log("📨 Sending email to ben@opencbct.com...");
  console.log("SUBJECT:", subject);
  console.log("MESSAGE:", message);
  return true;
}

// ===========================
// BOOK VIEWER (커스텀 3D 플립)
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  // ---- GATE ELEMENTS ----
  const accessGate = document.getElementById("accessGate");
  const siteContent = document.getElementById("siteContent");

  const requestForm = document.getElementById("requestForm");
  const requestEmail = document.getElementById("requestEmail");
  const requestPhone = document.getElementById("requestPhone");
  const requestHelper = document.getElementById("requestHelper");

  const passwordForm = document.getElementById("passwordForm");
  const passwordInput = document.getElementById("passwordInput");
  const passwordError = document.getElementById("passwordError");

  const investorMessageForm = document.getElementById("investorMessageForm");
  const investorMessage = document.getElementById("investorMessage");
  const sendBtn = document.querySelector(".send-btn");
  const sentConfirm = document.getElementById("sentConfirm");

  // ---- BOOK ELEMENTS ----
  const pageImgLeft = document.getElementById("pageImgLeft");
  const pageImgRight = document.getElementById("pageImgRight");
  const pagePrevBtn = document.getElementById("pagePrev");
  const pageNextBtn = document.getElementById("pageNext");

  const pageLeftSlot = document.querySelector(".page-left .page-inner");
  const pageRightSlot = document.querySelector(".page-right .page-inner");

  let currentLeftPage = 1; // 1,3,5,...

  function pagePath(n) {
    return `../css/book/${n}.png`;
  }

  function showSpread(leftPageNumber) {
    currentLeftPage = leftPageNumber;
    const rightPageNumber = Math.min(leftPageNumber + 1, TOTAL_PAGES);

    pageImgLeft.src = pagePath(leftPageNumber);
    pageImgLeft.alt = `Page ${leftPageNumber}`;

    pageImgRight.src = pagePath(rightPageNumber);
    pageImgRight.alt = `Page ${rightPageNumber}`;
  }

  // 초기: 1–2 페이지
  if (pageImgLeft && pageImgRight) {
    showSpread(1);
  }

  // 앞으로 (다음 페이지 쌍)
  function goNext() {
    if (currentLeftPage + 1 >= TOTAL_PAGES) return; // 23–24가 마지막
    if (!pageRightSlot) return;

    pageRightSlot.classList.add("flip-next");

    pageRightSlot.addEventListener(
      "animationend",
      () => {
        pageRightSlot.classList.remove("flip-next");
        showSpread(currentLeftPage + 2);
        pageRightSlot.style.transform = "rotateY(0deg)";
      },
      { once: true }
    );
  }

  // 뒤로 (이전 페이지 쌍)
  function goPrev() {
    if (currentLeftPage <= 1) return;
    if (!pageLeftSlot) return;

    pageLeftSlot.classList.add("flip-prev");

    pageLeftSlot.addEventListener(
      "animationend",
      () => {
        pageLeftSlot.classList.remove("flip-prev");
        showSpread(currentLeftPage - 2);
        pageLeftSlot.style.transform = "rotateY(0deg)";
      },
      { once: true }
    );
  }

  // 버튼 이벤트
  if (pageNextBtn) pageNextBtn.addEventListener("click", goNext);
  if (pagePrevBtn) pagePrevBtn.addEventListener("click", goPrev);

  // 페이지 자체 클릭
  if (pageRightSlot) pageRightSlot.addEventListener("click", goNext);
  if (pageLeftSlot) pageLeftSlot.addEventListener("click", goPrev);

  // 키보드 ← →
  document.addEventListener("keydown", (e) => {
    if (siteContent.classList.contains("hidden")) return; // gate 안 열렸으면 무시
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  });

  // ===========================
  // 1) PASSWORD REQUEST
  // ===========================
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

      passwordInput && passwordInput.focus();
    });
  }

  // ===========================
  // 2) PASSWORD VALIDATION → GATE OPEN
  // ===========================
  if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      passwordError.textContent = "";

      const pw = passwordInput.value.trim();

      if (pw === DEMO_PASSWORD) {
        accessGate.classList.add("hidden");
        siteContent.classList.remove("hidden");
        // 책은 이미 세팅되어 있으니 따로 init 필요 없음
      } else {
        passwordError.textContent = "Invalid password.";
      }
    });
  }

  // ===========================
  // 3) INVESTOR MESSAGE → email to Ben
  // ===========================
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
