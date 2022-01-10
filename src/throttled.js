function throttled(
	fn,
	interval = 500,
	options = { leading: true, trailing: false, resultCallback: null }
) {
	// 获取options里面的参数
	const { leading, trailing, resultCallback } = options
	// 初始化上一次函数执行的时间
	let lastTime = 0
	// 初始化定时器的标识
	let timer = null

	const _throttled = function (...args) {
		// debugger
		// 获取当前事件触发时的时间
		const nowTime = new Date().getTime()

		// 判断第一次是否需要执行函数
		if (!lastTime && !leading) lastTime = nowTime

		// 获取时间间隔
		const remainTime = interval - (nowTime - lastTime)
		if (remainTime <= 0) {
			if (timer) {
				clearTimeout(timer)
				timer = null
			}

			const result = fn.apply(this, args)
			if (resultCallback && typeof resultCallback === "function") {
				resultCallback(result)
			} else {
				throw TypeError("resultCallback not a function")
			}

			lastTime = nowTime

			return
		}

		if (trailing && !timer) {
			timer = setTimeout(() => {
				const result = fn.apply(this, args)
				if (resultCallback && typeof resultCallback === "function") {
					resultCallback(result)
				} else {
					throw TypeError("resultCallback not a function")
				}

				timer = null
				// 看第一次是否需要执行函数,如需要则当前函数执行完,获取当前函数执行完的时间
				lastTime = leading ? new Date().getTime() : 0
			}, remainTime)
		}
	}

	_throttled.cancel = function () {
		// 调用取消方法以后,初始化节流函数的默认值
		if (timer) clearTimeout(timer)
		timer = null
		lastTime = 0
	}

	return _throttled
}

// 测试
const inputEl = document.querySelector("input")
let counter = 0

const inputChange = throttled(
	function (event) {
		console.log(`发送了第${++counter}次网络请求`, this, event)

		// 返回值
		return 11111111111
	},
	2000,
	{
		leading: true,
		trailing: true,
		resultCallback(res) {
			console.log(res)
		},
	}
)

inputEl.oninput = inputChange

document.querySelector("#btn").onclick = inputChange.cancel
