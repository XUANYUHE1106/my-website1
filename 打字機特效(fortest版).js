document.addEventListener("DOMContentLoaded", function() {
  const typewriterElements = document.querySelectorAll(".typewriter");
  typewriterElements.forEach(initTypewriter);
});

function initTypewriter(container) {
  

  const initialText = container.dataset.text || "Initial text";
  const finalText = container.dataset.textFinal || "Final text";
  const typingSpeed = parseInt(container.dataset.speed) || 150;
  const deletingSpeed = parseInt(container.dataset.deleteSpeed) || 100;
  const pauseTime = parseInt(container.dataset.pause) || 1000;
  
  const bgmSrc = container.dataset.bgm;
  let bgm = null;
  
  if (bgmSrc) {
    bgm = new Audio(bgmSrc);
    bgm.loop = true; 
    bgm.volume = 0.2;
  }


  const textElement = container.querySelector(".typewriter-text");
  
  if (!textElement) {
    console.error("Typewriter setup error: missing .typewriter-text span inside", container);
    return;
  }

  let state = 'typing_initial'; 
  let index = 0;

  // --- 4. 核心函式 ---

  // (A) 打字函式 (第一段)
  function typeInitialText() {
    if (index < initialText.length) {
      textElement.textContent += initialText.charAt(index);
      index++;
      setTimeout(typeInitialText, typingSpeed);
    } else {
      state = 'idle';
      index = 0; 
    }
  }

  // (B) 刪除函式
  function deleteLetter() {
    let currentLength = textElement.textContent.length;
    if (currentLength > 0) {
      textElement.textContent = textElement.textContent.substring(0, currentLength - 1);
      setTimeout(deleteLetter, deletingSpeed);
    } else {
      state = 'waiting'; 
      setTimeout(function() {
        state = 'typing_final';
        typeFinalText(); 
      }, pauseTime);
    }
  }

      // [新增] 如果有設定 BGM，就在這裡開始播放

    
  
  function typeFinalText() {
    if (index < finalText.length) {
      textElement.textContent += finalText.charAt(index);
      index++;
      setTimeout(typeFinalText, typingSpeed);
        if (bgm) {
            bgm.play().catch(e => console.log("BGM 播放失敗:", e));
        }
    } else {
      state = 'final';
      removeListeners();
    }
}

  // (D) 點擊處理
  function handleClick(event) {
    event.preventDefault(); 
    if (state === 'idle') {
      state = 'deleting';
      deleteLetter();
    }
  }

  // (E) 移除監聽
  function removeListeners() {
    container.removeEventListener('click', handleClick);
    container.removeEventListener('contextmenu', handleClick);
  }

  // --- 5. 啟動與綁定 ---
  document.addEventListener('click', handleClick);
  document.addEventListener('contextmenu', handleClick);

  typeInitialText();
}