// 逆地理编码
export const reGeocoder = function (lnglatXY = []) {
  // 已知点坐标
  // const lnglatXY = [116.40, 39.99]
  const geocoder = new window.AMap.Geocoder({
    radius: 1000,
    extensions: 'all'
  })
  geocoder.getAddress(lnglatXY, function (status, result) {
    console.log('address', result)
    if (status === 'complete' && result.info === 'OK') {
      const address = result.regeocode.formattedAddress
      console.log('address', address)
      return address
    } else {
      return false
    }
  })
}
