const PersonForm = (props) => {
	const { handleSubmit,
					handleChangeName,
					handleChangeNumber,
					newName,
					newNumber } = props;

					return (
		<form onSubmit={handleSubmit}>
			<div>
				name: <input onChange={handleChangeName} value={newName}/>
				number: <input onChange={handleChangeNumber} value={newNumber}/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

export default PersonForm