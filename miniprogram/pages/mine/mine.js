const util = require('../../utils/util.js');

Page({
  data: {
    fundCount: 0,
    refreshOptions: ['30秒', '1分钟', '2分钟', '5分钟'],
    refreshIndex: 1
  },

  onShow() {
    const funds = util.getFavoriteFunds();
    this.setData({
      fundCount: funds.length
    });
  },

  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  onRefreshIntervalChange(e) {
    const index = e.detail.value;
    this.setData({ refreshIndex: index });
    
    const intervals = [30000, 60000, 120000, 300000];
    wx.setStorageSync('refreshInterval', intervals[index]);
    
    wx.showToast({
      title: '设置成功',
      icon: 'success'
    });
  }
});