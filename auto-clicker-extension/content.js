// ブレインロッド オートクリッカー
let autoClickInterval = null;
let isEnabled = false;

// 一番安い購入可能なロッドを見つけてクリック
function clickCheapestRod() {
  // 購入可能なロッドカードを取得（cannot-affordクラスがないもの）
  const allCards = document.querySelectorAll('.rod-card:not(.cannot-afford)');

  if (allCards.length === 0) {
    return; // 購入可能なロッドがない
  }

  // 価格を解析して一番安いものを見つける
  let cheapestCard = null;
  let cheapestPrice = Infinity;

  allCards.forEach(card => {
    const priceElement = card.querySelector('.rod-price');
    if (priceElement) {
      const priceText = priceElement.textContent;
      const price = parsePrice(priceText);

      if (price < cheapestPrice) {
        cheapestPrice = price;
        cheapestCard = card;
      }
    }
  });

  // 一番安いロッドをクリック
  if (cheapestCard) {
    cheapestCard.click();
  }
}

// 価格テキストを数値に変換
function parsePrice(priceText) {
  // 「💰 100 円」「💰 1.5 万円」「💰 2.00 億円」などを解析
  const text = priceText.replace('💰', '').trim();

  let multiplier = 1;
  let numStr = text;

  if (text.includes('兆')) {
    multiplier = 1e12;
    numStr = text.replace('兆円', '').trim();
  } else if (text.includes('億')) {
    multiplier = 1e8;
    numStr = text.replace('億円', '').trim();
  } else if (text.includes('万')) {
    multiplier = 1e4;
    numStr = text.replace('万円', '').trim();
  } else {
    numStr = text.replace('円', '').trim();
  }

  const num = parseFloat(numStr) || 0;
  return num * multiplier;
}

// オートクリックを開始
function startAutoClick(interval = 100) {
  if (autoClickInterval) {
    clearInterval(autoClickInterval);
  }

  isEnabled = true;
  autoClickInterval = setInterval(clickCheapestRod, interval);
  console.log('ブレインロッド オートクリッカー: 開始');
}

// オートクリックを停止
function stopAutoClick() {
  if (autoClickInterval) {
    clearInterval(autoClickInterval);
    autoClickInterval = null;
  }
  isEnabled = false;
  console.log('ブレインロッド オートクリッカー: 停止');
}

// 拡張機能のポップアップからのメッセージを受信
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    if (isEnabled) {
      stopAutoClick();
    } else {
      startAutoClick(request.interval || 100);
    }
    sendResponse({ enabled: isEnabled });
  } else if (request.action === 'getStatus') {
    sendResponse({ enabled: isEnabled });
  } else if (request.action === 'setInterval') {
    if (isEnabled) {
      startAutoClick(request.interval);
    }
    sendResponse({ success: true });
  }
  return true;
});

// ストレージから状態を復元
chrome.storage.local.get(['autoClickEnabled', 'autoClickInterval'], (result) => {
  if (result.autoClickEnabled) {
    startAutoClick(result.autoClickInterval || 100);
  }
});
