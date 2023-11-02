const PersonDisplay = ({ persons, handleDelete }) => (
	<table>
		<tbody>
			{persons.map(person => (
				<tr className='person' key={person.name}>
					<td>{person.name}</td>
					<td>{person.number}</td>
					<td>
						<button onClick={() => handleDelete(person.id)}>
							delete
						</button>
					</td>
				</tr>
			))}
		</tbody>
	</table>
)

export default PersonDisplay