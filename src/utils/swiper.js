/**
 * [侧滑删除， 暂时只支持左滑，微信中右滑会回到上一级页面]
 * @param  {[type]} bindpath    [需要添加滑动删除的元素class,like. '.package-table tr']
 * @param  {[type]} swiperclass [滑动后给元素添加的class,like. 'swiperleft']
 * @return {[type]}             [description]
 */
const remove = function (bindpath, swiperclass) {
	const $this = this
	const container = window.document.querySelectorAll(bindpath)
	// 为每个特定DOM元素绑定touchstart touchmove时间监听 判断滑动方向
	for (let i = 0; i < container.length; i++) {
	  let x, X
	  // 记录初始触控点横坐标
	  container[i].addEventListener('touchstart', function (event) {
	    x = event.changedTouches[0].pageX
	  })
	  container[i].addEventListener('touchmove', function (event) {
	    // 记录当前触控点横坐标
	    X = event.changedTouches[0].pageX
	    // 判断是否展开，如果展开则收起
	    if ($this.expansion) {
	      $this.expansion.className = ''
	    }
	    // 右滑收起
	    if (X - x > 10) {
	      this.className = this.className.replace(swiperclass, '')
	    }
	    // 左滑展开
	    if (x - X > 10) {
	      this.className = swiperclass
	      $this.expansion = this
	    }
	  })
	}
}
