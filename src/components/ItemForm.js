import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editItemThunk } from '../store/items';

const ItemForm = ({ itemId, hideForm }) => {
  console.log("🚀 ~ file: ItemForm.js:6 ~ ItemForm ~ itemId, hideForm :", itemId, hideForm )
  const dispatch = useDispatch()

  let item = useSelector(state => state.items[itemId === 'add mode' ? 0:itemId]);
  const [happiness, setHappiness] = useState(itemId === 'add mode' ? '':item.happiness);
  const [price, setPrice] = useState(itemId === 'add mode' ? '':item.price);
  const [name, setName] = useState(itemId === 'add mode' ? '':item.name);

  
  const updateName = (e) => setName(e.target.value);
  const updateHappiness = (e) => setHappiness(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      //...item,
      name,
      happiness,
      price
    };
    
    let returnedItem = dispatch(editItemThunk(payload));
    if (returnedItem) {
      hideForm();
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    hideForm();
  };

  return (
    <section className="edit-form-holder centered middled">
      <form className="item-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={updateName}
        />
        <input
          type="number"
          placeholder="Happiness"
          min="0"
          max="100"
          required
          value={happiness}
          onChange={updateHappiness}
        />
        <input
          type="number"
          placeholder="Price"
          required
          value={price}
          onChange={updatePrice}
        />
        <button type="submit">Update Item</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </form>
    </section>
  );
};

export default ItemForm;