const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    keyword: '',
    searchResults: [],
    searched: false,
    hotFunds: [
      { code: '161039', name: '易方达消费行业股票' },
      { code: '161725', name: '招商中证白酒指数' },
      { code: '110011', name: '易方达中小盘混合' },
      { code: '000311', name: '景顺长城沪深300指数增强' },
      { code: '161706', name: '招商中证银行指数' },
      { code: '001552', name: '天弘中证银行指数A' }
    ]
  },

  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  async onSearch() {
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      return;
    }

    wx.showLoading({ title: '搜索中...' });

    try {
      let results = [];
      if (/^\d{6}$/.test(keyword)) {
        const data = await api.getFundValue(keyword);
        if (data) {
          results = [{ code: data.code, name: data.name }];
        }
      } else {
        const searchResults = await this.searchByKeyword(keyword);
        results = searchResults;
      }

      this.setData({
        searchResults: results,
        searched: true
      });
    } catch (err) {
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  async searchByKeyword(keyword) {
    return new Promise((resolve) => {
      const results = this.data.hotFunds.filter(f => 
        f.name.includes(keyword) || f.code.includes(keyword)
      );
      if (results.length > 0) {
        resolve(results);
      } else {
        const allFunds = this.generateAllFunds();
        const matched = allFunds.filter(f => 
          f.name.includes(keyword) || f.code.includes(keyword)
        );
        resolve(matched.slice(0, 10));
      }
    });
  },

  generateAllFunds() {
    return [
      { code: '161039', name: '易方达消费行业股票' },
      { code: '161725', name: '招商中证白酒指数' },
      { code: '110011', name: '易方达中小盘混合' },
      { code: '000311', name: '景顺长城沪深300指数增强' },
      { code: '161706', name: '招商中证银行指数' },
      { code: '001552', name: '天弘中证银行指数A' },
      { code: '161130', name: '易方达医药卫生股票' },
      { code: '001703', name: '南方中小盘成长混合' },
      { code: '000596', name: '中证煤炭指数' },
      { code: '161017', name: '富国中证银行指数' }
    ];
  },

  addFund(e) {
    const { code, name } = e.currentTarget.dataset;
    const success = util.addFavoriteFund({ code, name });
    
    if (success) {
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    } else {
      wx.showToast({
        title: '已添加到自选',
        icon: 'none'
      });
    }
  }
});