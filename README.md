# Ahoy

Github Link: https://github.com/fabio-gabriel/threejs-CG

Final project for the Computer Graphics 2025.1 class. Here you will find a three.js scene of some old timey ships floating in the ocean. You can click on the ship to push it around.

## how to run 
`npx vite`

Then access http://localhost:5173/

## Water 
To make the water, I used a plane, the Water shader and the waternormals texture offered by one of the three.js examples. By updating the time variable from the shader it can create effects like waves over time.

## Lighting
The lighting comes from two sources to make shadows look more realistic. The main source of light is the Image based lighting from `scene.environment = texture`. This uses the brightness of the background to create lighting, and gives the image almost an "omnidirectional" light appearence to make it look more realistic. 

However this cannot cast shadows. To fix this I added a `DirectionalLight` as close to the background image's actual sun to cast light shadows on the ship. They are more noticeble on the ship's sails and deck, just zoom in with the camera.

## Physics
The physics is handled by rapier. Apart from gravity, I simulated buoyancy and ship stability as it tries to stay upright. The math on this is really hard and I am not a naval engineer, so they are pretty wobbly ships.