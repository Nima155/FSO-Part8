import { useMutation } from "@apollo/client"
import React, { useState, useEffect } from "react"
import LOGIN from "../graphql/mutations/login"

export default function Login({ show, setToken }) {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [login, result] = useMutation(LOGIN, { onError: () => {} })

	useEffect(() => {
		if (result.data) {
			window.localStorage.setItem("userInfo", result.data.login.value)
			setToken(result.data.login.value)
		}
	}, [result.data])

	if (!show) {
		return null
	}
	function onFormSubmit(e) {
		e.preventDefault()
		login({ variables: { password, username } }) // send the user pass to the server for validation
	}
	function onUsernameChange(event) {
		setUsername(event.target.value)
	}
	function onPasswordChange(event) {
		setPassword(event.target.value)
	}

	return (
		<div style={{ margin: 10 }}>
			{window.localStorage.getItem("userInfo") ? (
				<p>Logged in</p>
			) : (
				<form onSubmit={onFormSubmit}>
					<label>
						username:
						<input type="text" value={username} onChange={onUsernameChange} />
					</label>
					<br />
					<label>
						password:
						<input
							type="password"
							value={password}
							onChange={onPasswordChange}
						/>
					</label>
					<br />
					<button type="submit">Login</button>
				</form>
			)}
		</div>
	)
}
