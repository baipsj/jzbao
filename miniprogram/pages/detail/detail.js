const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    fundCode: '',
    fundInfo: {
      code: '',
      name: '',
      netValue: null,
      estimateValue: null,
      estimateChange: null,
      netDate: '',
      estimateTime: ''
    },
    isFavorite: false
  },

  onLoad(options) {
    const { code } = options;
    if (code) {
      this.setData({ fundCode: code });
      this.loadFundInfo(code);
    }
  },

  async loadFundInfo(code) {
    wx.showLoading({ title: '加载中...' });

    try {
      const data = await api.getFundValue(code);
      
      this.setData({
        fundInfo: {
          code: data.code,
          name: data.name,
          netValue: data.netValue,
          estimateValue: data.estimateValue,
          estimateChange: data.estimateChange,
          netDate: data.netDate,
          estimateTime: data.estimateTime
        },
        isFavorite: util.isFavorite(code)
      });

      wx.setNavigationBarTitle({
        title: data.name
      });
    } catch (err) {
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  toggleFavorite() {
    const { fundCode, isFavorite } = this.data;
    
    if (isFavorite) {
      util.removeFavoriteFund(fundCode);
      this.setData({ isFavorite: false });
      wx.showToast({
        title: '已取消自选',
        icon: 'none'
      });
    } else {
      const fundInfo = this.data.fundInfo;
      util.addFavoriteFund({
        code: fundInfo.code,
        name: fundInfo.name
      });
      this.setData({ isFavorite: true });
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });
    }
  }
});