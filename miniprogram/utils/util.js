function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) {
    return '--';
  }
  return Number(num).toFixed(decimals);
}

function formatPercent(num) {
  if (num === null || num === undefined || isNaN(num)) {
    return '--';
  }
  const sign = num > 0 ? '+' : '';
  return sign + Number(num).toFixed(2) + '%';
}

function formatTime(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getFavoriteFunds() {
  return wx.getStorageSync('favoriteFunds') || [];
}

function saveFavoriteFunds(funds) {
  wx.setStorageSync('favoriteFunds', funds);
}

function addFavoriteFund(fund) {
  const funds = getFavoriteFunds();
  const exists = funds.some(f => f.code === fund.code);
  if (!exists) {
    funds.unshift(fund);
    saveFavoriteFunds(funds);
    return true;
  }
  return false;
}

function removeFavoriteFund(fundCode) {
  const funds = getFavoriteFunds();
  const index = funds.findIndex(f => f.code === fundCode);
  if (index > -1) {
    funds.splice(index, 1);
    saveFavoriteFunds(funds);
    return true;
  }
  return false;
}

function isFavorite(fundCode) {
  const funds = getFavoriteFunds();
  return funds.some(f => f.code === fundCode);
}

module.exports = {
  formatNumber,
  formatPercent,
  formatTime,
  getFavoriteFunds,
  saveFavoriteFunds,
  addFavoriteFund,
  removeFavoriteFund,
  isFavorite
};