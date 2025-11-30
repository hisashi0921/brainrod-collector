// DOM要素
const statusEl = document.getElementById('status');
const toggleBtn = document.getElementById('toggleBtn');
const intervalSelect = document.getElementById('intervalSelect');

let isEnabled = false;

// 状態を更新
function updateUI(enabled) {
  isEnabled = enabled;

  if (enabled) {
    statusEl.textContent = '動作中';
    statusEl.className = 'status on';
    toggleBtn.textContent = '停止';
    toggleBtn.className = 'toggle-btn stop';
  } else {
    statusEl.textContent = '停止中';
    statusEl.className = 'status off';
    toggleBtn.textContent = '開始';
    toggleBtn.className = 'toggle-btn start';
  }
}

// 現在のタブにメッセージを送信
async function sendMessageToTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    try {
      return await chrome.tabs.sendMessage(tab.id, message);
    } catch (e) {
      console.log('コンテンツスクリプトに接続できません');
      return null;
    }
  }
  return null;
}

// トグルボタンクリック
toggleBtn.addEventListener('click', async () => {
  const interval = parseInt(intervalSelect.value);
  const response = await sendMessageToTab({ action: 'toggle', interval });

  if (response) {
    updateUI(response.enabled);
    // 状態を保存
    chrome.storage.local.set({
      autoClickEnabled: response.enabled,
      autoClickInterval: interval
    });
  }
});

// 間隔変更
intervalSelect.addEventListener('change', async () => {
  const interval = parseInt(intervalSelect.value);
  await sendMessageToTab({ action: 'setInterval', interval });
  chrome.storage.local.set({ autoClickInterval: interval });
});

// 初期化
async function init() {
  // 保存された間隔を復元
  const stored = await chrome.storage.local.get(['autoClickInterval']);
  if (stored.autoClickInterval) {
    intervalSelect.value = stored.autoClickInterval;
  }

  // 現在の状態を取得
  const response = await sendMessageToTab({ action: 'getStatus' });
  if (response) {
    updateUI(response.enabled);
  }
}

init();
