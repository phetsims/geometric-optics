// Copyright 2022, University of Colorado Boulder

/**
 * TODO https://github.com/phetsims/geometric-optics/issues/326
 * This is a collection of temporary types for options, missing from common code when this sim was implemented.
 * As common code is converted to TypeScript, these temporary types should be replaced with the real deal.
 * The goal is to eventually delete this file.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';

export type SimOptions = {
  credits?: object;
  hasKeyboardHelpContent?: boolean;
  createOptionsDialogContent?: ( tandem: Tandem ) => Node;
};