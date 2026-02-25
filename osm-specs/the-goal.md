# GOAL

The goal is to produce a cartoonish 3D reperentation of the world in the scope of a drone simulator.

The plan is to use OSM map features + some DEM data and to dynamically generate a 3D visualization.

Anything which cannot be resolved dynamically is out of scope.
Anything which is not "physical" is out of scope (label, boundaries...)

feature will have to be render either:

- as a 3D mesh with texture (buildings...)
- printed on the ground texture (waters...)
- both (a forest will appear green on the ground texture, on produce some trees - 3D instanced mesh)
