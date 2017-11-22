<template>
  <div class="bind">
    <canvas id="Mycanvas" width="541" height="780" style="opacity: .5"></canvas>
    <div class="bind-container">
     <div class="logo">
       <img src="../../assets/images/logo.png" alt="logo">
       <h1 v-once>国际快递服务中心</h1>
     </div>
     <div class="input mobile">
       <div>
         <img src="../../assets/images/bin_ico_pho.png" alt="phone">
       </div>
       <div>
         <input style="max-width: 10rem;" type="text" name="mobile" v-model="mobile" placeholder="输入手机号" required />
       </div>
       <div class="getcode">
         <button v-show="getting === false && (mobile.toString().length < 11) === true" type="" class="button btn-get-disable">获取验证码</button>
         <button v-show="getting === false && (mobile.toString().length >= 11) ===true" type="" class="button btn-get" @click="getCode">获取验证码</button>
         <span v-show="getting === true" style="white-space: nowrap;font-size: 1.2rem;">{{time + ' s 后可重新获取'}}</span>
       </div>
     </div>
     <div class="input mobile" @click="foucsOnCode">
       <div>
         <img src="../../assets/images/bin_ico_ver.png" alt="phone">
       </div>
       <div>
         <input style="max-width: 10rem;" id="inputCode" type="number" name="mobile" v-model="code" placeholder="输入验证码" required />
       </div>
       <div class="getcode">
         <button type="" class="" style="color: transparent;background:transparent;border:none;">获取验证码</button>
       </div>
     </div>
     <div class="input mobile" @click="foucsOnShenfen">
       <div>
         <img src="../../assets/images/bin_ico_car.png" alt="phone">
       </div>
       <div>
         <input style="max-width: 10rem;" id="inputShenfen" type="text" name="mobile" v-model="idcard" :placeholder="idcardHolder" />
       </div>
       <div class="getidtype">
          <selector direction="ltr" v-model="IDcardType" placeholder="选择证件类型" name="district" :options="IDcardOption">
          </selector>
        </div>
     </div>
     <div class="submit-btn" style="padding-top: 4rem;">
       <button class="normal" @click="submitPhone">确定</button>
     </div>
    </div>
  </div>
</template>
<script>
import { XInput, Selector } from 'vux'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'bindphone',
  created () {
  },
  components: {
    XInput,
    Selector
  },
  data () {
    return {
      mobile: '',
      sendmobile: '',
      code: '',
      idcard: '',
      getting: false,
      time: 30,
      isSubmit: false,
      IDcardType: '身份证',
      IDcardOption: [{
        key: '身份证',
        value: '身份证'
      }, {
        key: '护照',
        value: '护照'
      }]
    }
  },
  mounted () {
    // window.document.title = '手机绑定'
    // canvas 动画效果
    // 定义画布宽高和生成点的个数
    let WIDTH = window.innerWidth
    let HEIGHT = window.innerHeight
    let POINT = 35
    let canvas = document.getElementById('Mycanvas')
    canvas.width = WIDTH
    canvas.height = HEIGHT
    let context = canvas.getContext('2d')
    context.strokeStyle = 'rgba(0,0,0,0.2)'
    context.strokeWidth = 1
    context.fillStyle = 'rgba(0,0,0,0.1)'
    let circleArr = []
    // 线条：开始xy坐标，结束xy坐标，线条透明度
    function Line (x, y, _x, _y, o) {
      this.beginX = x
      this.beginY = y
      this.closeX = _x
      this.closeY = _y
      this.o = o
    }
    // 点：圆心xy坐标，半径，每帧移动xy的距离
    function Circle (x, y, r, moveX, moveY) {
      this.x = x
      this.y = y
      this.r = r
      this.moveX = moveX
      this.moveY = moveY
    }
    // 生成max和min之间的随机数
    function num (max, _min) {
      let min = arguments[1] || 0
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
    // 绘制原点
    function drawCricle (cxt, x, y, r, moveX, moveY) {
      let circle = new Circle(x, y, r, moveX, moveY)
      cxt.beginPath()
      cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
      cxt.closePath()
      cxt.fill()
      return circle
    }
    // 绘制线条
    function drawLine (cxt, x, y, _x, _y, o) {
      let line = new Line(x, y, _x, _y, o)
      cxt.beginPath()
      cxt.strokeStyle = 'rgba(0,0,0,' + o + ')'
      cxt.moveTo(line.beginX, line.beginY)
      cxt.lineTo(line.closeX, line.closeY)
      cxt.closePath()
      cxt.stroke()
    }
    // 初始化生成原点
    function init () {
      circleArr = []
      for (let i = 0; i < POINT; i++) {
        circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10) / 40, num(10, -10) / 40))
      }
      draw()
    }
    // 每帧绘制
    function draw () {
      context.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < POINT; i++) {
        drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r)
      }
      for (let i = 0; i < POINT; i++) {
        for (let j = 0; j < POINT; j++) {
          if (i + j < POINT) {
            let A = Math.abs(circleArr[i + j].x - circleArr[i].x)
            let B = Math.abs(circleArr[i + j].y - circleArr[i].y)
            let lineLength = Math.sqrt(A * A + B * B)
            let C = 1 / lineLength * 7 - 0.009
            let lineOpacity = C > 0.03 ? 0.03 : C
            if (lineOpacity > 0) {
              drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i + j].x, circleArr[i + j].y, lineOpacity)
            }
          }
        }
      }
    }
    // 调用执行
    init()
    setInterval(function () {
      for (let i = 0; i < POINT; i++) {
        let cir = circleArr[i]
        cir.x += cir.moveX
        cir.y += cir.moveY
        if (cir.x > WIDTH) cir.x = 0
        else if (cir.x < 0) cir.x = WIDTH
        if (cir.y > HEIGHT) cir.y = 0
        else if (cir.y < 0) cir.y = HEIGHT
      }
      draw()
    }, 16)
  },
  computed: {
    ...mapGetters({
      'openid': 'getOpenId',
      'smscode': 'getSmsCode'
    }),
    idcardHolder () {
      return this.IDcardType === '身份证' ? '输入身份证' : '输入护照'
    }
  },
  methods: {
    ...mapActions([
      'setOpenid',
      'smsSend',
      'bindUser',
      'setUserInfo'
    ]),
    setTime () {
      const _this = this
      const timeval = setInterval(function () {
        if (_this.time === 1) {
          clearInterval(timeval)
          _this.getting = false
          _this.time = 30
          return
        }
        _this.time--
      }, 1000)
    },
    foucsOnCode () {
      window.document.getElementById('inputCode').focus()
    },
    foucsOnShenfen () {
      window.document.getElementById('inputShenfen').focus()
    },
    async getCode () {
      if (!this.mobile) {
        this.$vux.toast.show({
          text: '手机号不能为空!',
          type: 'warn',
          width: '15rem'
        })
        return
      }
      const regphone = /^1[0-9]{10}$/
      if (!regphone.test(this.mobile)) {
        this.$vux.toast.show({
          text: '请输入正确的手机号',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      if (!this.openid) {
        this.$vux.toast.show({
          text: '请重新登录',
          type: 'text',
          width: '20rem'
        })
        return
      }
      this.getting = true
      this.setTime()
      const res = await this.smsSend({
        mobile: this.mobile
      })
      this.$vux.toast.show(res)
      const mb = this.mobile
      if (res.type === 'success') {
        this.sendmobile = mb
      }
      return
    },
    async submitPhone () {
      if (this.isSubmit) return
      if (this.code !== this.smscode) {
        this.$vux.toast.show({
          text: '验证码不匹配',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      if (!this.sendmobile) {
        this.$vux.toast.show({
          text: '手机号出错, 请重新输入',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      const idcardReg1 = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/
      const idcardReg2 = /(^\d{15}$)|(^\d{17}([0-9]|x)$)/
      const passportReg1 = /^[a-zA-Z0-9]{3,21}$/
      const passportReg2 = /^(P\d{7})|(G\d{8})$/
      if (this.IDcardType === '身份证' && !idcardReg1.test(this.idcard) && !idcardReg2.test(this.idcard)) {
        this.$vux.toast.show({
          text: '请填入正确的身份证号码',
          type: 'warn',
          width: '18rem'
        })
        return
      } else if (this.IDcardType === '护照' && !passportReg1.test(this.idcard) && !passportReg2.test(this.idcard)) {
        this.$vux.toast.show({
          text: '请填入正确的护照号',
          type: 'warn',
          width: '18rem'
        })
        return
      }
      this.isSubmit = true
      const bindres = await this.bindUser({
        mobile: this.sendmobile,
        IDcard: this.IDcardType === '身份证' ? this.idcard.toUpperCase() : this.idcard,
        openid: this.openid
      })
      this.$vux.toast.show(bindres)
      this.isSubmit = false
      const _this = this
      if (bindres.type === 'success') {
        setTimeout(async function () {
          await _this.getUserInfoByOpenid({openid: _this.openid})
        }, 1500)
      }
    },
    async getUserInfoByOpenid ({openid}) {
      const userinfo = await this.setUserInfo({openid})
      if (userinfo.type === 'text') {
        // 用户未绑定手机， 跳转绑定手机页面
        this.$router.push({path: '/bindphone'})
        return
      } else if (userinfo.type === 'success') {
        // 获取用户信息成功, 根据page跳转页面
        let {page} = this.$route.query
        const _this = this
        switch (page) {
          case 2:
            _this.$router.push({path: '/send'})
            break
          case 3:
            _this.$router.push({path: '/usercenter'})
            break
          default:
            _this.$router.push({path: '/usercenter'})
            break
        }
      } else {
        this.$vux.toast.show(userinfo)
        return
      }
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../assets/styles/colors.less';
@import '../../assets/styles/helpers.less';

.btn-normal {
  border-radius: @radius-size;
  padding: .3rem .3rem;
  font-size: @normal-size;
}

.btn-get {
  .btn-normal;
  color: @m-yellow;
  border: 1px solid @m-yellow;
  background: transparent
}

.btn-get-disable {
  .btn-normal;
  color: @greybtn;
  border: 1px solid @greybtn;
}

.getcode {
  width: 9rem;
  select {
    font-size: @small-size!important;
  }
}

.getidtype {
  width: 9.9rem;
  select {
    font-size: @small-size!important;
  }
}

.bind {
  background:#f7fafc;
  height: 100vh;
  overflow: hidden;
  *height: 62rem;
  &-container {
    width: 84%;
    position: fixed;
    top: 0;
    padding: 2.5rem;
    .logo {
      padding: 1rem;
      padding-bottom: 1.2rem;
      img {
        width: 30%;
      }
    }
    .input {
      margin-top: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-bottom: 1px solid @borderbt;
      div {
        padding: .5rem;
        img {
          width: 1.5rem;
        }
        input {
          padding: .4rem;
          border: none;
          height: 2.6rem;
          font-size: @normal-size;
          background: transparent;
        }
      }
    }
  }
}
</style>
