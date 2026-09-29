title: GMAN
slug: gman
category: tech
date: 2026-09-06
modified: 2026-09-29
summary: A RenderMan-compatible renderer with a path tracer, a ray tracer and a radiosity pass. Point it at a .rib file, get a picture.

![A room in which a tilted table drops a glass vase, its flowers and water flying, as a small robot on six wheels braces against the table's edge, path-traced by gman]({static}/images/2026/gman-vase-pathtraced.png)

[GMAN](https://github.com/jac18281828/gman) is an open-source, RenderMan-compatible renderer. Point it at a `.rib` file and choose a renderer with `-r`. `gmanzbuffer` is the default preview. `gmanraytracer` adds shadows, reflection, refraction and transparency. `gmanpathtracer` adds light bounced off every surface, soft shadows from area lights and glossy reflection.

### Get it

Download the build for your machine from the [releases page](https://github.com/jac18281828/gman/releases): Linux x86_64, Linux arm64 or macOS arm64. Then unpack it and install:

```sh
tar xzf gman-1.0.0-linux-x86_64.tar.gz
cd gman-1.0.0-linux-x86_64
sudo ./install.sh
```

The runtime libraries, another prefix and uninstalling are in the [README](https://github.com/jac18281828/gman#install).

### Ray trace it

From the unpacked folder:

```sh
gman -r gmanraytracer samples/vase.rib
```

That writes `vase.png`, a ray-traced render of the scene above, in a few seconds.

### Path trace it

Add one line to `samples/vase.rib`, under `PixelSamples 2 2`, and render it through the path tracer:

```
Option "pathtracer" "integer samples" [64]
```

```sh
gman -r gmanpathtracer samples/vase.rib
```

That writes the picture at the top of this page. Sixty-four paths through each of the four subpixels follow the light as it bounces off the walls, floor and table. The render takes about three minutes on one core of an Apple M3 Max, where the ray tracer takes seconds. The path tracer computes the bounce light the scene's `ambientlight` stood in for, so it skips that light and says so:

```
gmanpathtracer: ambientlight lights nothing under the path tracer; skipped 1 light(s).
```

### Bounce light under the ray tracer

The ray tracer adds bounce light through a radiosity pass. Add one line to `samples/vase.rib`, under `PixelSamples 2 2`, and render it through the ray tracer as before:

```
Option "render" "string indirect" ["radiosity"]
```

The pass dices the scene into patches and solves the diffuse light bouncing between them by progressive refinement, colour bleeding included. Each surface picks the result up through `ambient()`, weighted by its own `Ka`. Set `Ka` equal to `Kd` on each `Surface` and drop the `ambientlight`, which the pass replaces. `Option "radiosity" "float elementsize"` sets the patch size, an eighth of the scene's largest side by default.

### Poke it

Change one line of `samples/vase.rib` and render it again with `gman -r gmanraytracer samples/vase.rib`. Each picture starts from the original scene.

<div class="feature">
<img class="render" src="{static}/images/2026/gman-glass.png" alt="the vase in glass">
<div>
<p><strong>Glass vase.</strong> In the <code>## Vase</code> block, make the surface <code>Surface "glass"</code> and delete the <code>Opacity</code>.</p>
</div>
</div>

<div class="feature flip">
<img class="render" src="{static}/images/2026/gman-mirror.png" alt="the robot's dome as a mirror">
<div>
<p><strong>Mirror dome.</strong> Under <code># head dome</code>, make the surface <code>Surface "mirror" "Kr" [1]</code>.</p>
</div>
</div>

<div class="feature">
<img class="render" src="{static}/images/2026/gman-sunlight.png" alt="the room lit by sunlight">
<div>
<p><strong>Sunlight.</strong> Swap the lamp for the sun: <code>LightSource "distantlight" 2 "intensity" [1.2] "lightcolor" [1 0.95 0.83] "from" [1 3 10] "to" [0 0 1]</code>. The walls now shadow the room.</p>
</div>
</div>

<div class="feature flip">
<img class="render" src="{static}/images/2026/gman-zbuffer.png" alt="the scene through the z-buffer renderer">
<div>
<p><strong>The z-buffer.</strong> No edit: plain <code>gman samples/vase.rib</code> renders the fast preview, without shadows, reflection or refraction.</p>
</div>
</div>

### What it renders

- **Geometry.** `Polygon`, `GeneralPolygon`, `PointsPolygons`, `PointsGeneralPolygons` and the seven quadrics, `Sphere`, `Cone`, `Cylinder`, `Hyperboloid`, `Paraboloid`, `Disk` and `Torus`, under every renderer. `Patch` and `PatchMesh`, bilinear and bicubic, and `NuPatch` under the z-buffer.
- **Surface shaders.** `matte`, `plastic`, `paintedplastic`, `metal` and `shinymetal` under every renderer; `glass` and `mirror` trace rays, so they need the ray tracer or the path tracer.
- **Light shaders.** `ambientlight`, `distantlight`, `pointlight` and `spotlight`, and `AreaLightSource "arealight"`, which makes the `Sphere` or `Disk` after it glow under the path tracer.
- **Three renderers.** `gmanzbuffer`, the default preview; `gmanraytracer`, with shadows, reflection, refraction and transparency; and `gmanpathtracer`, which adds light bounced off every surface, soft shadows from area lights and glossy reflection.
- **Bounce light.** Under the ray tracer, `Option "render" "string indirect" ["radiosity"]` adds a radiosity pass: it solves the diffuse light bouncing between surfaces, colour bleeding included, and each surface picks it up through `ambient()`, weighted by its `Ka`. `Option "radiosity" "float elementsize"` sets the solver's patch size, an eighth of the scene by default. Set `Ka` equal to `Kd` and drop the `ambientlight`, which the pass replaces.
- **Antialiasing.** `PixelSamples` supersamples; `PixelFilter` reconstructs through box, triangle, Gaussian, Catmull-Rom or sinc.
- **Textures.** `texture()` and `environment()` read maps written by `MakeTexture` and `MakeLatLongEnvironment`.
- **RIB.** Plain or gzip'd, with `ReadArchive`. An unrecognized request warns once and is skipped.
- **Image drivers.** TIFF, PNM, PNG and JPEG; `gman --version` lists the ones built in.

### A first scene

Eleven lines, from nothing. Save them as `first.rib`:

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

```sh
gman -r gmanraytracer first.rib
```

### Build from source

Requires CMake 3.21 or newer, a C++20 compiler with `<format>` (GCC 13 or Clang 17 or newer), libtiff and zlib. libpng and libjpeg are optional: a build without one rejects that `Display` extension with `RIE_BADFILE`, and `gman --version` lists the drivers compiled in. POSIX only: macOS and Linux.

```sh
git clone https://github.com/jac18281828/gman.git
cd gman
cmake --preset dev
cmake --build build --parallel
```

To install into a prefix:

```sh
cmake --install build --prefix /usr/local
```

The installed prefix carries `bin/gman` and a CMake package. A program links gman with `find_package(gman CONFIG REQUIRED)` and `target_link_libraries(app PRIVATE gman::gman_core)`, and includes `<gman/ri.h>`.

### New to RenderMan?

RenderMan is the interface Pixar published for turning a 3D scene description into an image: cameras, geometry, lights and shaders, all in a plain-text RIB file. It's the API behind decades of film rendering, but the implementations that speak it are proprietary, heavyweight, or both.

### Where to find it

[GitHub](https://github.com/jac18281828/gman), with its [releases](https://github.com/jac18281828/gman/releases) and [changelog](https://github.com/jac18281828/gman/blob/1.0.0/CHANGELOG.md), and the original [SourceForge site](https://gman-toolkit.sourceforge.net). Begun in 1999, revived in 2026, licensed LGPL-2.1-or-later.
