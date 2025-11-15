/**
 * 表单验证工具
 */

/**
 * 验证姓氏
 */
export function validateSurname(surname: string): { valid: boolean; message?: string } {
  if (!surname) {
    return { valid: false, message: '请输入姓氏' }
  }

  if (surname.length < 1 || surname.length > 2) {
    return { valid: false, message: '姓氏长度应为1-2个汉字' }
  }

  // 验证是否为中文
  const chineseReg = /^[\u4e00-\u9fa5]+$/
  if (!chineseReg.test(surname)) {
    return { valid: false, message: '姓氏只能包含中文' }
  }

  return { valid: true }
}

/**
 * 验证日期
 */
export function validateDate(
  year: number,
  month: number,
  day: number
): { valid: boolean; message?: string } {
  const currentYear = new Date().getFullYear()

  if (year < 1900 || year > currentYear) {
    return { valid: false, message: `年份应在1900-${currentYear}之间` }
  }

  if (month < 1 || month > 12) {
    return { valid: false, message: '月份应在1-12之间' }
  }

  // 验证日期合法性
  const date = new Date(year, month - 1, day)
  if (date.getDate() !== day) {
    return { valid: false, message: '请输入有效的日期' }
  }

  // 不能是未来日期
  if (date > new Date()) {
    return { valid: false, message: '出生日期不能是未来日期' }
  }

  return { valid: true }
}

/**
 * 验证时辰
 */
export function validateHour(hour: number): { valid: boolean; message?: string } {
  if (hour < 0 || hour > 23) {
    return { valid: false, message: '时辰应在0-23之间' }
  }

  return { valid: true }
}

/**
 * 验证八字表单
 */
export function validateBaziForm(form: {
  surname: string
  year: number
  month: number
  day: number
  hour: number
  gender: string
}): { valid: boolean; message?: string } {
  // 验证姓氏
  const surnameResult = validateSurname(form.surname)
  if (!surnameResult.valid) {
    return surnameResult
  }

  // 验证日期
  const dateResult = validateDate(form.year, form.month, form.day)
  if (!dateResult.valid) {
    return dateResult
  }

  // 验证时辰
  const hourResult = validateHour(form.hour)
  if (!hourResult.valid) {
    return hourResult
  }

  // 验证性别
  if (!form.gender) {
    return { valid: false, message: '请选择性别' }
  }

  return { valid: true }
}
