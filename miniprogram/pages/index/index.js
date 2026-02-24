const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    funds: [],
    lastUpdateTime: '',
    loading: false
  },

  onLoad() {
    this.loadFavoriteFunds();
  },

  onShow() {
    this.loadFavoriteFunds();
  },

  onPullDownRefresh() {
    this.refreshFunds().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadFavoriteFunds() {
    const favoriteFunds = util.getFavoriteFunds();
    if (favoriteFunds.length > 0) {
      this.setData({
        funds: favoriteFunds.map(f => ({
          code: f.code,
          name: f.name,
          estimateValue: null,
          estimateChange: null
        }))
      });
      this.refreshFunds();
    } else {
      this.setData({
        funds: [],
        lastUpdateTime: ''
      });
    }
  },

  async refreshFunds() {
    const funds = this.data.funds;
    if (funds.length === 0 || this.data.loading) return;
    
    this.setData({ loading: true });
    wx.showLoading({ title: '加载中...' });

    try {
      const codes = funds.map(f => f.code);
      const results = await api.getFundsValue(codes);

      if (results.length === 0) {
        wx.showToast({
          title: '暂无数据',
          icon: 'none'
        });
        return;
      }

      const updatedFunds = funds.map(f => {
        const result = results.find(r => r.code === f.code);
        if (result) {
          return {
            ...f,
            estimateValue: result.estimateValue,
            estimateChange: result.estimateChange
          };
        }
        return f;
      });

      this.setData({
        funds: updatedFunds,
        lastUpdateTime: util.formatTime(new Date())
      });
    } catch (err) {
      console.error('获取基金数据失败:', err);
      wx.showToast({
        title: '获取数据失败，请检查网络',
        icon: 'none',
        duration: 2000
      });
    } finally {
      this.setData({ loading: false });
      wx.hideLoading();
    }
  },

  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  goToMine() {
    wx.navigateTo({
      url: '/pages/mine/mine'
    });
  },

  goToDetail(e) {
    const code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: `/pages/detail/detail?code=${code}`
    });
  }
});