self.addEventListener("push", event => {

	const message = event.data.text() // json | blob | arrayBuffer

	event.waitUntil(self.registration.showNotification(message))
})