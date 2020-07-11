const cookie = {
  read(name: string): string | null {
    // 正则表达式 match[0] 是整个匹配对象
    // 第一个括号以 开头 或 分号作为开头 match[1]
    // 第二个括号，name match[2]
    // 第三个括号，值  非; match[3]
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
