async function asyncHellAvoider(somePromise) {
	try {
		const data = await somePromise
		console.log(data)
		return [data, null]
	} catch (err) {
		console.log(err.message)
		return [null, err]
	}
}
module.exports = asyncHellAvoider
