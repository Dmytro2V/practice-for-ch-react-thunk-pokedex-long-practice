export const LOAD_ITEMS = "items/LOAD_ITEMS";
export const UPDATE_ITEM = "items/UPDATE_ITEM";
export const REMOVE_ITEM = "items/REMOVE_ITEM";
export const ADD_ITEM = "items/ADD_ITEM";

export const loadItemsThunk = (pokemonId) => async dispatch => {
  const responce = await fetch(`/api/pokemon/${pokemonId}/items`);
  
  console.log("🚀 ~ file: items.js:9 ~ loadItemsThunk ~ fetch(`/${pokemonId}:", pokemonId)
  
  if(responce.ok) {
    const items = await responce.json()
    dispatch(load(items, pokemonId))
  }
}

const load = (items, pokemonId) => ({
  type: LOAD_ITEMS,
  items,
  pokemonId
});

const update = (item) => ({
  type: UPDATE_ITEM,
  item
});

export const editItemThunk = (item) => async dispatch => {
  const responce = await fetch(`/api/items/${item.id}`, 
    {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(item)
    }
  );  
  if(responce.ok) {
    const items = await responce.json()
    dispatch(update(item))
  }
};

const add = (item) => ({
  type: ADD_ITEM,
  item
});
export const addItemThunk = (item, pokemonId) => async dispatch => {
  const responce = await fetch(`/api/pokemon/${pokemonId}/items`, 
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(item)
    }
  );  
  if(responce.ok) {
    const items = await responce.json()
    dispatch(add(item))
  }
};

const remove = (itemId) => ({
  type: REMOVE_ITEM,
  itemId,
  //pokemonId
});
export const deleteItemThunk = (item) => async dispatch => {
  const responce = await fetch(`/api/items/${item.id}`, 
    {
      method: 'DELETE'
    }
  );  
  if(responce.ok) {
    const id = await responce.json()
    dispatch(remove(id))
  }
};


const initialState = {};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ITEMS: 
      const newItems = {};
      action.items.forEach(item => {
        newItems[item.id] = item;
      })
      return {
        ...state,
        ...newItems
      }
    case REMOVE_ITEM: 
      const newState = { ...state };
      delete newState[action.itemId];
      return newState;
    case ADD_ITEM:
    case UPDATE_ITEM: 
      return {
        ...state,
        [action.item.id]: action.item
      };
    default:
      return state;
  }
};

export default itemsReducer;