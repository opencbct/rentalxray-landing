document.addEventListener("DOMContentLoaded", function () {
  // ===============================
  // 설정값
  // ===============================
  var DEMO_PASSWORD = "RENTAL2025";
  // book 폴더 안에 0.png ~ 23.png (총 24장)이라고 가정
  var TOTAL_PAGES = 25;

  var currentLeft = 0;   // 왼쪽 페이지 인덱스
  var currentRight = 1;  // 오른쪽 페이지 인덱스

  // ===============================
  // DOM 요소
  // ===============================
  var gateEl          = document.getElementById("accessGate");
  var siteEl          = document.getElementById("siteContent");

  var requestForm     = document.getElementById("requestForm");
  var requestEmail    = document.getElementById("requestEmail");
  var requestPhone    = document.getElementById("requestPhone");
  var requestHelper   = document.getElementById("requestHelper");

  var passwordForm    = document.getElementById("passwordForm");
  var passwordInput   = document.getElementById("passwordInput");
  var passwordError   = document.getElementById("passwordError");

  var pageImgLeft     = document.getElementById("pageImgLeft");
  var pageImgRight    = document.getElementById("pageImgRight");
  var pagePrevBtn     = document.getElementById("pagePrev");
  var pageNextBtn     = document.getElementById("pageNext");

  var pageLeftSlot    = document.querySelector(".page-left");
  var pageRightSlot   = document.querySelector(".page-right");

  var investorForm    = document.getElementById("investorMessageForm");
  var investorMessage = document.getElementById("investorMessage");
  var sendBtn         = investorForm
    ? investorForm.querySelector(".send-btn")
    : null;
  var sentConfirm     = document.getElementById("sentConfirm");

  // ===============================
  // 유틸: 페이지 이미지 경로
  // ===============================
  function pageSrc(index) {
    return "../css/book/" + index + ".png";
  }

  // ===============================
  // BOOK: 페이지 업데이트
  // ===============================
  function updatePages() {
    if (!pageImgLeft || !pageImgRight) return;

    if (currentLeft < 0) currentLeft = 0;
    if (currentRight >= TOTAL_PAGES) currentRight = TOTAL_PAGES - 1;

    pageImgLeft.src  = pageSrc(currentLeft);
    pageImgLeft.alt  = "Page " + currentLeft;
    pageImgRight.src = pageSrc(currentRight);
    pageImgRight.alt = "Page " + currentRight;

    if (pagePrevBtn) {
      pagePrevBtn.disabled = currentLeft <= 0;
      pagePrevBtn.style.opacity = pagePrevBtn.disabled ? 0.35 : 0.95;
    }
    if (pageNextBtn) {
      pageNextBtn.disabled = currentRight >= TOTAL_PAGES - 1;
      pageNextBtn.style.opacity = pageNextBtn.disabled ? 0.35 : 0.95;
    }
  }

  // ===============================
  // BOOK: 다음/이전 페이지 (파도치는 flip)
  // ===============================
    // 애니메이션 중복 방지 플래그
  var isFlipping = false;

  function goNext() {
    if (isFlipping) return;
    if (currentRight >= TOTAL_PAGES - 1) return;
    if (!pageRightSlot) return;

    isFlipping = true;
    pageRightSlot.classList.add("flip-next");

    setTimeout(function () {
      pageRightSlot.classList.remove("flip-next");
      currentLeft  += 2;
      currentRight += 2;
      updatePages();
      isFlipping = false;
    }, 700); // CSS 애니메이션 시간과 동일
  }

  function goPrev() {
    if (isFlipping) return;
    if (currentLeft <= 0) return;
    if (!pageLeftSlot) return;

    isFlipping = true;
    pageLeftSlot.classList.add("flip-prev");

    setTimeout(function () {
      pageLeftSlot.classList.remove("flip-prev");
      currentLeft  -= 2;
      currentRight -= 2;
      updatePages();
      isFlipping = false;
    }, 700);
  }


  // ===============================
  // ACCESS GATE: 비밀번호 요청 (데모용)
  // ===============================
  if (requestForm) {
    requestForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var email = requestEmail ? requestEmail.value.trim() : "";
      var phone = requestPhone ? requestPhone.value.trim() : "";

      if (!email && !phone) {
        if (requestHelper) {
          requestHelper.textContent =
            "이메일 또는 휴대폰 번호 중 하나는 반드시 입력해 주세요.";
          requestHelper.style.color = "#ff5c7a";
        }
        return;
      }

      if (requestHelper) {
        requestHelper.textContent =
          "감사합니다. 데모 버전에서는 아래 비밀번호(RENTAL2025)를 바로 사용해 주세요.";
        requestHelper.style.color = "#a5b0d4";
      }
    });
  }

  // ===============================
  // ACCESS GATE: 비밀번호 체크
  // ===============================
  if (passwordForm) {
    passwordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = passwordInput ? passwordInput.value.trim() : "";

      if (!val) {
        if (passwordError) {
          passwordError.textContent = "비밀번호를 입력해 주세요.";
        }
        return;
      }

      if (val !== DEMO_PASSWORD) {
        if (passwordError) {
          passwordError.textContent =
            "비밀번호가 올바르지 않습니다. (힌트: RENTAL2025)";
        }
        return;
      }

      // 성공: 게이트 숨기고 메인 컨텐츠 표시
      if (passwordError) passwordError.textContent = "";

      if (gateEl) gateEl.classList.add("hidden");
      if (siteEl) siteEl.classList.remove("hidden");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===============================
  // INVEST 폼: 프론트 데모 애니메이션
  // ===============================
  if (investorForm) {
    investorForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var msg = investorMessage ? investorMessage.value.trim() : "";
      if (!msg) {
        alert("문의 내용을 간단히라도 적어 주세요.");
        return;
      }

      // 실제로는 서버로 POST
      if (sendBtn) {
        sendBtn.classList.add("sent");
      }
      if (sentConfirm) {
        sentConfirm.classList.add("visible");
      }
    });
  }

  // ===============================
  // BOOK: 이벤트 연결
  // ===============================
  if (pageNextBtn) {
    pageNextBtn.addEventListener("click", goNext);
  }
  if (pagePrevBtn) {
    pagePrevBtn.addEventListener("click", goPrev);
  }

  // 페이지 클릭으로도 넘기기
  if (pageRightSlot) {
    pageRightSlot.addEventListener("click", goNext);
  }
  if (pageLeftSlot) {
    pageLeftSlot.addEventListener("click", goPrev);
  }

  // 초기 페이지 세팅
  updatePages();
});
