App({
  onLaunch() {
    this.initFavoriteFunds();
  },

  initFavoriteFunds() {
    const funds = wx.getStorageSync('favoriteFunds');
    if (!funds) {
      wx.setStorageSync('favoriteFunds', []);
    }
  },

  globalData: {
    userInfo: null,
    refreshInterval: null
  }
})