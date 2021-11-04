// Copyright 2021, University of Colorado Boulder

//TYPESCRIPT https://github.com/phetsims/chipper/issues/1139 what pattern should be used here?

type t = {
  [ key: string ]: string,
  'geometric-optics': {
    title: string,
  },
  screen: {
    [ key: string ]: string,
  }
  // add additional nested keys here
};
let geometricOpticsStrings: t;
export default geometricOpticsStrings;