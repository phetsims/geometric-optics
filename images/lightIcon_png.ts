/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAxCAYAAABznEEcAAAACXBIWXMAABcRAAAXEQHKJvM/AAAEzUlEQVRogd1af0gbVxz/vktiUi8XjkjD0oGVdF26mkhCsDXCUBB19p9ZEVYU6xibmzC2Fbqt7L/5z5gUO/qXtGXU+c8GQir+ky7xj7V/TKqWrepGCj2Mum7dpsYsgdZNb7xM5yV3yb3L3S12HzjIvV/5fN573+/7vvcO8TwPTzuMTw3/jQkKKAYAMTxYA1k9v79FrF4sA8Rg8hQgZhsAtnaefSzi5zOYrAUoxgSIMQGVIf7XDvG8KL2IJT8mSwNiDmTI7/V2QeJClEYEV24FxNiAYqyZ6bLX28TEhdBdRF1dXY3BYLgAAD6LxWJbXo4z98PQKCCNBaiCbiLcbveLPM9f9/v9z7a2tpodDkcm/drV4RWAh6TNCAwYCZ5s6CLC4/F86fP52js6Osw0TUsXEnPJUwjJFtZcRCAQmOru7j7p9XqLbIGMuBCaisACent7T7pcLtIqfDZpcuJCUEXVkgCeQp2dnYQCBKTz8yaOhzQR0djYeKq6urq9+CmkDpqISCaTl3t6eswKq2X3tCJDz4ZqEVVVVecbGhqOkJZPpdMGgmJErnUXqkXY7fa3mpqaiMtbaZpgVS5IXGQrqkTg1TgQCBCPgjRyvBNS7qGIXCw23GQy2UfTNCtMTyQSrmAwWAxxXklPy0FWRG1t7TmXy/VJf39//tVXyR8a0aErN07c/H1t88FHb/z6et6C0gMiKZBkOp3DnkcLARiszUT1nX3B0X7qSPDTz50XldUu0js5nc5tZX9EhuPPs2CxWBru3AMbGXEdvZMavPzS4fLv7h98R9AELyJOYOeSNuH3+8NGo8mCfx89+txhvURUVVphPbHlJYyf8hq8SER9fX2opaWl1e0+lnmPRiPasZYAy1rMACn5ggVGRCSioqLivXA4HJidvZuxBYfjoG4jgVFmonZtougDMJGIiYmJOABU7r53dXXperq2+ed2kqBYThiSjZIaNmQWzMdP5EsVNvSSilhcSoGVhjvSueQbJVkRHMc9KoohASK3fkrXVq9fzQ5DlO/wZMMOp9P57uDg4LW2tjZrbh5exRVsRbPwzbe/wNpa6taJGiRnE7I2KSsiFAp9hRC6ybLsq7l5Kysrbw8MDCiKYhMbm1tXvvhxdSP55O6Hr62eB2CUVJcEURTL83wCAD7LTfd4PDaO4z5WMhrJ5NpsX/v8m0AxW1oIALWGvbCwcHlsbIxgpSqIQtNFHIZo7WLxCKXT6YV0Oq2mmTzQ0DvJIZVKvT8+Pq6cX0HSyryTahGxWOz2zMwMp3w0kNwOjxiaLHZ2u/306OgowcorFCCL//bwbGpq6t7i4uKNubk5ZRXVDcC/0CzsmJ+fPzMyMrLMcZxWTQqgo3fKRSwWqxkaGnpEKGRvusgaemFoKgK73Hg8fmx4ePj7ycnJIlpAAoPPA9orytP8fmJndffho55IJPJBc3PzM/igefemKA9pVQai23XX9PT0JQC4hK+9otHoKyzLenC62fT4awCUAECigLJYHbpfPOJ1BABuS2YuHcfBEz7QOiBI1f4EUFdU/vAHAOAH4OHpMgAoz3BCUraa31b2zxcFh0KbeMud+f3bBXz8bwJAxn9OmAvPs/3/lc36dQSIMQDFoMz3HUxQdDXwv/hUqOSnHaoBAH8DItNPuAkJtqAAAAAASUVORK5CYII=';
export default image;