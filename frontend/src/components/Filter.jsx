const Filter = ({ handleChangeFilter, newFilter }) => (
  <div>filter shown with 
    <input 
			onChange={handleChangeFilter} 
      value={newFilter}
    />
  </div>
)

export default Filter