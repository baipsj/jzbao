const BASE_URL = 'https://fundgz.1234567.com.cn';

function getFundValue(fundCode) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/js/${fundCode}.js`,
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.data && typeof res.data === 'string') {
          try {
            const jsonStr = res.data.replace(/^jsonpgz\(|\);?$/g, '');
            const data = JSON.parse(jsonStr);
            if (data.fundcode) {
              resolve({
                code: data.fundcode,
                name: data.name,
                netValue: parseFloat(data.dwjz) || 0,
                estimateValue: parseFloat(data.gsz) || 0,
                estimateChange: parseFloat(data.gszzl) || 0,
                netDate: data.jzrq,
                estimateTime: data.gztime
              });
            } else {
              reject(new Error('基金数据无效'));
            }
          } catch (e) {
            reject(new Error('数据解析失败: ' + e.message));
          }
        } else {
          reject(new Error('未获取到数据'));
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

function getFundsValue(fundCodes) {
  const promises = fundCodes.map(code => getFundValue(code));
  return Promise.allSettled(promises).then(results => {
    return results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
  });
}

module.exports = {
  getFundValue,
  getFundsValue
};