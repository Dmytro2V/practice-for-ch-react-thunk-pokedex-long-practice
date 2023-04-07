export default function fixmoves(pokemon) { //string to array
  return {...pokemon, moves: pokemon.moves.split(',')}
}