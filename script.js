// ============================
//  공통 설정
// ============================
const DEMO_PASSWORD = "RENTAL2025";

// 실제 이메일 발송 대신 콘솔에만 찍는 더미 함수
async function sendEmailToBen(subject, message) {
  console.log("📨 SEND TO: ben@opencbct.com");
  console.log("SUBJECT:", subject);
  console.log("MESSAGE:\n", message);
  return true;
}

// ============================
//  DOM 준비되면 실행
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // ---------- 1) ACCESS GATE ----------
  const accessGate   = document.getElementById("accessGate");
  const siteContent  = document.getElementById("siteContent");

  const requestForm  = document.getElementById("requestForm");
  const requestEmail = document.getElementById("requestEmail");
  const requestPhone = document.getElementById("requestPhone");
  const requestHelper = document.getElementById("requestHelper");

  const passwordForm  = document.getElementById("passwordForm");
  const passwordInput = document.getElementById("passwordInput");
  const passwordError = document.getElementById("passwordError");

  const investorMessageForm = document.getElementById("investorMessageForm");
  const investorMessage     = document.getElementById("investorMessage");
  const sendBtn      = document.querySelector(".send-btn");
  const sentConfirm  = document.getElementById("sentConfirm");

  // 1-1) 패스워드 요청 (email / phone)
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

  // 1-2) 비밀번호 입력 → 북/본문 열기
  if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!passwordInput) return;

      const pw = passwordInput.value.trim();
      passwordError.textContent = "";

      if (pw === DEMO_PASSWORD) {
        if (accessGate)  accessGate.classList.add("hidden");
        if (siteContent) siteContent.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        passwordError.textContent = "Invalid password.";
      }
    });
  }

  // 1-3) 투자 메세지 → Ben
  if (investorMessageForm && investorMessage && sendBtn && sentConfirm) {
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

  // ---------- 2) BOOK VIEWER ----------
  const book     = document.getElementById("bookViewer");
  const imgLeft  = document.getElementById("pageImgLeft");
  const imgRight = document.getElementById("pageImgRight");
  const btnPrev  = document.getElementById("pagePrev");
  const btnNext  = document.getElementById("pageNext");
  const slotLeft  = document.querySelector(".page-left");
  const slotRight = document.querySelector(".page-right");

  if (!book || !imgLeft || !imgRight || !slotLeft || !slotRight) return;

  const TOTAL_PAGES = 24;  // 1.png ~ 24.png
  const pages = Array.from(
    { length: TOTAL_PAGES },
    (_, i) => `../css/book/${i + 1}.png`
  );

  const totalSpreads = Math.ceil(TOTAL_PAGES / 2);
  let spreadIndex = 0;   // 0 → (1,2), 1 → (3,4) ...
  let isTurning = false;

  function applySpread() {
    const leftIndex  = spreadIndex * 2;
    const rightIndex = leftIndex + 1;

    if (leftIndex < pages.length) {
      imgLeft.src = pages[leftIndex];
      imgLeft.alt = `Page ${leftIndex + 1}`;
      imgLeft.style.visibility = "visible";
    } else {
      imgLeft.style.visibility = "hidden";
    }

    if (rightIndex < pages.length) {
      imgRight.src = pages[rightIndex];
      imgRight.alt = `Page ${rightIndex + 1}`;
      imgRight.style.visibility = "visible";
    } else {
      imgRight.style.visibility = "hidden";
    }
  }

  // 첫 spread (1–2)
  applySpread();

  function goNext() {
    if (isTurning) return;
    if (spreadIndex >= totalSpreads - 1) return;
    isTurning = true;

    slotRight.classList.add("flipping-next");

    setTimeout(() => {
      spreadIndex += 1;
      applySpread();
    }, 400);

    setTimeout(() => {
      slotRight.classList.remove("flipping-next");
      isTurning = false;
    }, 800);
  }

  function goPrev() {
    if (isTurning) return;
    if (spreadIndex <= 0) return;
    isTurning = true;

    slotLeft.classList.add("flipping-prev");

    setTimeout(() => {
      spreadIndex -= 1;
      applySpread();
    }, 400);

    setTimeout(() => {
      slotLeft.classList.remove("flipping-prev");
      isTurning = false;
    }, 800);
  }

  // 오른쪽 페이지 클릭 → 다음
  slotRight.addEventListener("click", goNext);
  // 왼쪽 페이지 클릭 → 이전
  slotLeft.addEventListener("click", goPrev);

  if (btnNext) btnNext.addEventListener("click", goNext);
  if (btnPrev) btnPrev.addEventListener("click", goPrev);
});
