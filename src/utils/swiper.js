/**
 * [侧滑事件绑定，暂时只支持左滑，微信中右滑会回到上一级页面]
 * @param  {[type]} bindpath    [需要添加滑动删除的元素class,like. '.package-table tr']
 * @param  {[type]} swiperclass [滑动后给元素添加的class,like. 'swiperleft']
 * @return {[type]}             [description]
 */
export const bindSwiper = function (bindpath, swiperclass) {
  // 左滑删除
  const container = document.querySelectorAll(bindpath)
  // 为每个特定DOM元素绑定 touchstart
  for (let i = 0; i < container.length; i++) {
    // touchmove时间监听 判断滑动方向
    let startX
    let endX
    // 记录初始触控点横坐标
    container[i].addEventListener('touchstart', function (event) {
      startX = event.changedTouches[0].pageX
    })
    container[i].addEventListener('touchmove', function (event) {
      // 记录当前触控点横坐标
      endX = event.changedTouches[0].pageX
      // 右滑
      if (endX - startX > 10) {
        // 右滑收起
        this.className = ''
      }
      // 左滑
      if (startX - endX > 10) {
        // 左滑展开
        this.className = swiperclass
      }
    })
  }
}

/**
 * [从DOM中移除一个class]
 * @param  {[type]} bindpath    [需要添加滑动删除的元素class,like. '.package-table tr']
 * @param  {[type]} swiperclass [滑动后给元素添加的class,like. 'swiperleft']
 * @return {[type]}             [description]
 */
export const removeClass = function (bindpath, swiperclass) {
  const container = document.querySelectorAll(bindpath)
  // 为每个特定DOM元素绑定 touchstart
  for (let i = 0; i < container.length; i++) {
    container[i].className = container[i].className.replace(swiperclass, '')
  }
}

/**
 * [长按删除]
 * @param  {[type]} index  [description]
 * @param  {[type]} $event [description]
 * @return {[type]}        [description]
 */
export const longTap = function (index, $event) {
  const _this = this
  function longPress () {
    _this.$vux.confirm.show({
      title: `确定删除这一行数据吗? (当前为第${index + 1}行)`,
      onCancel () {
      },
      onConfirm () {
        _this.packageTable.splice(index, 1)
      }
    })
  }
  const longTimer = setTimeout(longPress, 900)
  $event.target.ontouchend = () => {
    clearTimeout(longTimer)
  }
}
