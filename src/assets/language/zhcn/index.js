import common from './common'
import send from './send'
import cargo from './cargo'
import usercenter from './usercenter'
import orderlist from './orderlist'
import promote from './promote'
import orderdetail from './orderdetail'
import address from './address'
import coupon from './coupon'
import route from './route'
import bottom from './bottom'
import component from './component'
import bussiness from './bussiness'
import boot from './boot'
import error from './error'
import assess from './assess'

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
promote,
component,
bussiness,
boot,
error,
assess,
{}
)

export default locale
