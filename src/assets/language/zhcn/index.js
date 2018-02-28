import common from './common'
import send from './send'
import cargo from './cargo'
import usercenter from './usercenter'
import orderlist from './orderlist'
import bottom from './bottom'
import orderdetail from './orderdetail'
import address from './address'
import coupon from './coupon'
import route from './route'

const locale = Object.assign(
common,
send,
cargo,
usercenter,
orderlist,
bottom,
orderdetail,
address,
coupon,
route,
{}
)

export default locale
