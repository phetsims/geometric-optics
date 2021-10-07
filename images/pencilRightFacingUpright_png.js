/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;