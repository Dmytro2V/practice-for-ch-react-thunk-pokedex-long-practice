export default function fixMoves(pokemon) { //string to array
  if (pokemon.moves) return {...pokemon, moves: pokemon.moves.split(',')}
  else return pokemon;
}