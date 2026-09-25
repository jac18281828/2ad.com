title: GMAN
slug: gman
category: tech
date: 2026-09-06
modified: 2026-09-25
summary: A RenderMan-compatible renderer with a ray tracer — point it at a .rib file, get a picture.

![gman's ray-traced render of the vase sample: a robot, a tipping vase of water and a lamp over the table]({static}/images/2026/gman-vase-raytraced.png)

RenderMan is the interface Pixar published for turning a 3D scene description into an image: cameras, geometry, lights and shaders, all in a plain-text RIB file. It's the API behind decades of film rendering, but the implementations that speak it are proprietary, heavyweight, or both.

[GMAN](https://github.com/jac18281828/gman) is an open-source, RenderMan-compatible renderer. Point it at a `.rib` file and it renders through one of two plugins: `gmanzbuffer`, a fast z-buffer preview, or `gmanraytracer`, with shadows, reflection, refraction and transparency.

### Try it

```sh
curl -sL https://github.com/jac18281828/gman/releases/download/0.9.1/gman-0.9.1-linux-x86_64.tar.gz | tar xz
curl -sLO https://raw.githubusercontent.com/jac18281828/gman/0.9.1/samples/vase.rib
export PATH="$PWD/gman-0.9.1-linux-x86_64/bin:$PATH"
gman -r gmanraytracer vase.rib
```

That writes `vase.png`, the picture above, in a few seconds. It needs libtiff, libpng, libjpeg and zlib installed. Linux arm64 and macOS arm64 builds are on the [releases page](https://github.com/jac18281828/gman/releases).

### Poke it

Change one line of `vase.rib` and render it again.

| | |
|---|---|
| ![the vase in glass]({static}/images/2026/gman-glass.png) **Glass vase.** In the `## Vase` block, make the surface `Surface "glass"` and delete the `Opacity`. | ![the robot's dome as a mirror]({static}/images/2026/gman-mirror.png) **Mirror dome.** Under `# head dome`, make the surface `Surface "mirror" "Kr" [1]`. |
| ![the room lit by sunlight]({static}/images/2026/gman-sunlight.png) **Sunlight.** Swap the lamp for `LightSource "distantlight" 2 "intensity" [1.2] "lightcolor" [1 0.95 0.83] "from" [1 3 10] "to" [0 0 1]`. | ![the scene through the z-buffer]({static}/images/2026/gman-zbuffer.png) **The z-buffer.** No edit: plain `gman vase.rib` renders the fast preview, without shadows, reflection or refraction. |

### What it renders

- **Geometry.** `Polygon`, `GeneralPolygon`, `PointsPolygons`, `PointsGeneralPolygons` and the seven quadrics — `Sphere`, `Cone`, `Cylinder`, `Hyperboloid`, `Paraboloid`, `Disk`, `Torus` — under both renderers. `Patch`, `PatchMesh` and `NuPatch` under the z-buffer.
- **Surface shaders.** `matte`, `plastic`, `paintedplastic`, `metal` and `shinymetal` under both renderers; `glass` and `mirror` trace rays, so they need the ray tracer.
- **Lights.** `ambientlight`, `distantlight`, `pointlight` and `spotlight`.
- **Antialiasing.** `PixelSamples` supersamples; `PixelFilter` reconstructs through box, triangle, Gaussian, Catmull-Rom or sinc.
- **Textures.** `texture()` and `environment()` read maps written by `MakeTexture` and `MakeLatLongEnvironment`.
- **RIB.** Plain or gzip'd, with `ReadArchive`. An unrecognized request warns once and is skipped.
- **Output.** TIFF, PNM, PNG and JPEG.

### A first scene

Save this as `first.rib`:

```
Display "first.png" "file" "rgba"
Format 640 400 1
Projection "perspective" "fov" [30]
Translate 0 0 6
WorldBegin
LightSource "ambientlight" 1 "intensity" [0.2]
LightSource "distantlight" 2 "from" [-2 2 -3] "to" [0 0 0]
Surface "plastic"
Color [0.9 0.25 0.2]
Sphere 1 -1 1 360
WorldEnd
```

Then render it:

```sh
gman -r gmanraytracer first.rib
```

`first.png` lands next to it: a red plastic sphere.

### Build from source

Needs CMake 3.21 or newer, a C++20 compiler with `<format>` (GCC 13 or Clang 17 or newer), libtiff and zlib; libpng and libjpeg are optional. POSIX only: macOS and Linux. A VS Code devcontainer is included.

```sh
git clone https://github.com/jac18281828/gman.git
cd gman
cmake --preset dev
cmake --build build --parallel
```

`cmake --install build` installs `gman` and a CMake package, so a C or C++ program can link the renderer with `find_package(gman)`. The [README](https://github.com/jac18281828/gman#readme) covers writing a shader and calling the RenderMan C API.

### Where to find it

- [GitHub](https://github.com/jac18281828/gman), with the [releases](https://github.com/jac18281828/gman/releases) and [changelog](https://github.com/jac18281828/gman/blob/main/CHANGELOG.md)
- The original project site, [gman-toolkit.sourceforge.net](https://gman-toolkit.sourceforge.net)

GMAN began in 1999 and was revived in 2026. It is licensed [LGPL-2.1-or-later](https://github.com/jac18281828/gman/blob/main/COPYING).
