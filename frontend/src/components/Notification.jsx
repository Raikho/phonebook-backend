const Notification = ({ message }) => {
	if (message.status === 'clear')
		return null

		
	if (message.status === 'error') {
		return ( 
			<div className='message error'>
				Error: {message.text}
			</div>
		)
	}
	else {
		return ( 
			<div className='message success'>
				{message.text}
			</div>
		)
	}
		
}

export default Notification