import { LOAD_ITEMS, REMOVE_ITEM, ADD_ITEM } from './items';
import fixMoves from './fixmoves'
const LOAD = 'pokemon/LOAD';
const LOAD_TYPES = 'pokemon/LOAD_TYPES';
const ADD_ONE = 'pokemon/ADD_ONE';
//const CREATE = 'pokemon/CREATE';

const load = list => ({
  type: LOAD,
  list
});

const loadTypes = types => ({
  type: LOAD_TYPES,
  types
});

const addOnePokemon = pokemon => ({
  type: ADD_ONE,
  pokemon
});

export const addPokemon = (id) => async dispatch => {
  console.log("🚀 ~ file: pokemon.js:26 ~ addingPokemon to store ~ id:", id)
  const response = await fetch(`/api/pokemon/${id}`);

  if (response.ok) {
    const pokemon = await response.json();
    dispatch(addOnePokemon(pokemon));
  }
};

export const getPokemon = () => async dispatch => {
  const response = await fetch(`/api/pokemon`);

  if (response.ok) {
    const list = await response.json();
    dispatch(load(list));
  }
};

export const getPokemonTypes = () => async dispatch => {
  const response = await fetch(`/api/pokemon/types`);

  if (response.ok) {
    const types = await response.json();
    dispatch(loadTypes(types));
  }
};
export const createPokemonThunk = (pokemon) => async dispatch => {
  const response = await fetch(`/api/pokemon`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(pokemon)
    }
  );
  if (response.ok) {
    const pokemon = await response.json();
    dispatch(addOnePokemon(pokemon));
    return pokemon; // probably dispatch thunk return goes to dispatch return
  } else return false
};

export const editPokemonThunk = (pokemon) => async dispatch => {
  const response = await fetch(`/api/pokemon/${pokemon.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(pokemon)
    }
  );
  if (response.ok) {
    const pokemon = await response.json();
    dispatch(addOnePokemon(pokemon));
    return pokemon; // probably dispatch thunk return goes to dispatch return
  } else return false

}


const initialState = {
  list: [],
  types: []
};

const sortList = (list) => {
  return list.sort((pokemonA, pokemonB) => {
    return pokemonA.number - pokemonB.number;
  }).map((pokemon) => pokemon.id);
};

const pokemonReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const allPokemon = {};
      action.list.forEach(pokemon => {
        allPokemon[pokemon.id] = fixMoves(pokemon);
        //console.log("🚀 ~ file: pokemon.js:57 ~ pokemonReducer ~ pokemon:", pokemon)      
      });
      return {
        ...allPokemon,
        ...state,
        list: sortList(action.list)
      };
    case LOAD_TYPES:
      return {
        ...state,
        types: action.types
      };
    case ADD_ONE:
      if (!state[action.pokemon.id]) {
        const newState = {
          ...state,
          [action.pokemon.id]: fixMoves(action.pokemon)
        };
        const pokemonList = newState.list.map(id => newState[id]);
        pokemonList.push(fixMoves(action.pokemon));
        console.log("🚀 ~ file: pokemon.js:78 ~ pokemonReducer ~ pokemon:", action.pokemon)
        newState.list = sortList(pokemonList);
        return newState;
      }
      return {
        ...state,
        [action.pokemon.id]: {
          ...state[action.pokemon.id],
          ...fixMoves(action.pokemon)
        }
      };
    case LOAD_ITEMS:
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: action.items.map(item => item.id)
        }
      };
    case REMOVE_ITEM:
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: state[action.pokemonId].items.filter(
            (itemId) => itemId !== action.itemId
          )
        }
      };
    case ADD_ITEM:
      console.log(action.item);
      return {
        ...state,
        [action.item.pokemonId]: {
          ...state[action.item.pokemonId],
          items: [...state[action.item.pokemonId].items, action.item.id]
        }
      };
    default:
      return state;
  }
}

export default pokemonReducer;