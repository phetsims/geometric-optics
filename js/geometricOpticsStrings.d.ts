// Copyright 2021, University of Colorado Boulder

//TODO https://github.com/phetsims/joist/issues/764 what pattern should be used here?

type t = {
  [ key: string ]: string,
  'geometric-optics': {
    title: string,
  },
  screen: {
    [ key: string ]: string,
  }
  //TODO add any other nested strings here
};
let geometricOpticsStrings: t;
export default geometricOpticsStrings;