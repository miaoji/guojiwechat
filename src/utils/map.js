// 逆地理编码
export const reGeocoder = function (lnglatXY = []) {
  return new Promise((resolve, reject) => {
    // 已知点坐标
    // const lnglatXY = [116.40, 39.99]
    const geocoder = new window.AMap.Geocoder({
      radius: 1000,
      extensions: 'all'
    })
    geocoder.getAddress(lnglatXY, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        return resolve(result)
      } else {
        return reject(false)
      }
    })
  })
}
