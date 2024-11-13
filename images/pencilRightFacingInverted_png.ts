/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;