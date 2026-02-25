# Key: `layer` — Vertical Layer

> Source: https://wiki.openstreetmap.org/wiki/Key:layer

## Description

The `layer=*` tag describes the vertical ordering of features that cross or overlap at the same geographic location. It establishes which feature passes above or below another without requiring them to share nodes.

Features without an explicit `layer` tag default to layer `0`. The tag conveys relative ordering, not absolute altitude — use `height=*` or `ele=*` for physical measurements.

## Element Types

- **Nodes / ways / areas / relations**: may be used

## Values

Numerical integers in the range **−5 to 5**. `layer=0` is the default and should not be tagged explicitly.

| Value | Meaning |
|-------|---------|
| `1`, `2`, … | Above ground (bridges, elevated roads) |
| `-1`, `-2`, … | Below ground (tunnels, underpasses) |

## Status

De facto

---

## Usage conventions

Always pair with the appropriate modifier tag:

| Situation | Tags |
|-----------|------|
| Simple road bridge | `bridge=yes` + `layer=1` |
| Flyover bridge | `bridge=yes` + `layer=2` |
| Road tunnel | `tunnel=yes` + `layer=-1` |
| Elevated railway | `bridge=yes` + `layer=1` on `railway=*` |
| Underground railway | `tunnel=yes` + `layer=-1` on `railway=*` |
| Building over road | `building:part=*` + `layer=1` |

## Notes

- Negative `layer` values do not automatically imply underground — use `location=underground` for that.
- When two features cross at the same layer value they are treated as at-grade (sharing surface level).
- The tag is almost always combined with `bridge=*`, `tunnel=*`, `covered=*`, or `indoor=yes`.
