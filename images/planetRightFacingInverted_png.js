/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;