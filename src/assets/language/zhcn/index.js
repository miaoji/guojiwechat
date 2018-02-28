import common from './common'
import send from './send'
import cargo from './cargo'
import usercenter from './usercenter'
import orderlist from './orderlist'
import promote from './promote'
import orderdetail from './orderdetail'
import address from './address'
import bottom from './bottom'

const locale = Object.assign(common, send, cargo, usercenter, orderlist, bottom, promote, orderdetail, address, {})

export default locale
