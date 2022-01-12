// Copyright 2021-2022, University of Colorado Boulder

/**
 * RulersToolbox is the toolbox that holds the rulers.
 * It has no responsibility for the behavior of its contents (icons) or the rulers.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { HBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GORulerNode from './GORulerNode.js';

type Options = {
  tandem: Tandem
} & PanelOptions;

class RulersToolbox extends Panel {

  /**
   * @param rulerNodes - in the order that they appear in the toolbox, left to right
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( rulerNodes: GORulerNode[], zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>, providedOptions: Options ) {

    const toolboxContent = new HBox( {
      spacing: 20,
      children: rulerNodes.map( rulerNode => rulerNode.iconNode ),
      excludeInvisibleChildrenFromBounds: false
    } );

    super( toolboxContent, merge( {

      // Panel options
      align: 'center',
      cornerRadius: 5,
      xMargin: 20,
      yMargin: 7,
      fill: 'white',
      stroke: 'grey'
    }, providedOptions ) );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'RulersToolbox', RulersToolbox );
export default RulersToolbox;