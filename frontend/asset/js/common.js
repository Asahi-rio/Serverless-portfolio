/* /asset/js/common.js */
(function (global) {
  'use strict';

  // ===========================
  //  Validator
  // ===========================
  const validate = {
    isRequired: (v) => v != null && v.trim().length > 0,
    isMaxLength: (v, max) => (v || '').trim().length <= max,
	isTel: v => /^[0-9]{7,20}$/.test((v || '').trim()),
    isEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim()),
  };

  // ===========================
  //  Error helpers
  // ===========================
  /**
   * 対象input直後にある .error を取得。無ければ作成して返す。
   */
  function getErrorEl(input) {
    let el = input.nextElementSibling;
    if (!el || !el.classList.contains('error')) {
      el = document.createElement('p');
      el.className = 'error';
      el.hidden = true;
      input.insertAdjacentElement('afterend', el);
    }
    return el;
  }

  function showError(input, message) {
    const el = getErrorEl(input);
    el.textContent = message;
    el.hidden = false;
    input.classList.add('invalid');
  }

  function hideError(input) {
    const el = getErrorEl(input);
    el.hidden = true;
    input.classList.remove('invalid');
  }

  // ===========================
  //  Utility
  // ===========================
  /**
   * 文字数カウントを表示する簡易ユーティリティ
   * @param {HTMLTextAreaElement|HTMLInputElement} field
   * @param {HTMLElement} counterEl 例: <span id="detailCount">
   * @param {number} max
   */
  function bindCharCount(field, counterEl, max) {
    const update = () => {
      const len = (field.value || '').length;
      if (counterEl) counterEl.textContent = len;
      if (typeof max === 'number' && len > max) {
        showError(field, `${max}文字以内で入力してください（現在 ${len} 文字）`);
      } else {
        hideError(field);
      }
    };
    field.addEventListener('input', update);
    update();
  }

  // ===========================
  //  Export
  // ===========================
  global.Common = Object.assign(global.Common || {}, {
    version: '1.0.0',
    validate,
    getErrorEl,
    showError,
    hideError,
    bindCharCount,
  });

  // デバッグ用ログ（不要なら消してOK）
  if (global && global.console) {
    console.log('common.js loaded (non-module)', global.Common);
  }
})(window);