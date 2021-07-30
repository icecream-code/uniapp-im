export const showTimePipe = (unix_stamp) => { // unix_stamp 精确到微秒
  const _today_obj = new Date()
  const _today_date = {
	y: _today_obj.getFullYear(),
	m: (_today_obj.getMonth() + 1 < 10 ? '0' + (_today_obj.getMonth() - -1) : (_today_obj.getMonth() - -1)),
	d: (_today_obj.getDate() < 10 ? '0' + _today_obj.getDate() : _today_obj.getDate())
  }

  let _today_stamp = Date.parse(_today_date.y + '/' + _today_date.m + '/' + _today_date.d + ' 00:00:00')

  const stamp = []
  stamp[0] = _today_stamp + 86400000
  stamp[1] = _today_stamp
  stamp[2] = _today_stamp - 86400000
  stamp[3] = _today_stamp - 172800000

  stamp[4] = _today_stamp - 518400000 // 7天

  stamp[5] = _today_stamp - 31536000000 // 365天

  const _compare_obj = new Date()
  _compare_obj.setTime(unix_stamp)

  let return_str

  if (unix_stamp >= stamp[1] && unix_stamp < stamp[0]) {
    return_str = _compare_obj.getHours() + ':' + (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
  } else if (unix_stamp >= stamp[2] && unix_stamp < stamp[1]) {
    let yesterdayText = '昨天'
    return_str = yesterdayText + ' ' + _compare_obj.getHours() + ':' +
      (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
  } else if (unix_stamp >= stamp[3] && unix_stamp < stamp[2]) {
    let theDayBeforeYesterdayText = '前天'
    return_str = theDayBeforeYesterdayText + ' ' + _compare_obj.getHours() + ':' +
      (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())

  } else if (unix_stamp >= stamp[4] && unix_stamp < stamp[3]) { // 7天内
    const daynames = ['天', '一', '二', '三', '四', '五', '六']
    const dathStr = '星期' + daynames[_compare_obj.getDay()]

    const SundayText = '星期天'
    const MondayText = '星期一'
    const TuesdayText = '星期二'
    const WednesdayText = '星期三'
    const ThursdayText = '星期四'
    const FridayText = '星期五'
    const SaturdayText = '星期六'

    let dathStr2

    switch (dathStr) {
      case '星期天':
        dathStr2 = SundayText
        break
      case '星期一':
        dathStr2 = MondayText
        break
      case '星期二':
        dathStr2 = TuesdayText
        break
      case '星期三':
        dathStr2 = WednesdayText
        break
      case '星期四':
        dathStr2 = ThursdayText
        break
      case '星期五':
        dathStr2 = FridayText
        break
      case '星期六':
        dathStr2 = SaturdayText
        break
      default:
        dathStr2 = dathStr
        break
    }

    return_str = dathStr2 + ' ' + _compare_obj.getHours() + ':' +
      (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
  } else if (unix_stamp >= stamp[5] && unix_stamp < stamp[4]) { // 365天内
    let monthText = '月'
    let dayText = '日'
    return_str = (_compare_obj.getMonth() - (-1)) + monthText + _compare_obj.getDate() + dayText + ' '
      + _compare_obj.getHours() + ':' + (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())

  } else {
    let yearText = '年'
    let monthText = '月'
    let dayText = '日'
    return_str = _compare_obj.getFullYear() + yearText + (_compare_obj.getMonth() - (-1)) +
      monthText + _compare_obj.getDate() + dayText + ' ' + _compare_obj.getHours() + ':' +
      (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
  }
  return return_str
}
