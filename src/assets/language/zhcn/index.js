import common from './common'
import send from './send'
import cargo from './cargo'
import usercenter from './usercenter'
import orderlist from './orderlist'
import bottom from './bottom'

const locale = Object.assign(common, send, cargo, usercenter, orderlist, bottom, {})

export default locale
