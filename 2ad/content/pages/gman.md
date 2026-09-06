title: GMAN
slug: gman
category: tech
date: 2026-09-06
summary: A from-scratch RenderMan-compatible renderer — point it at a .rib file, get a picture.

![GMAN is at it again!]({static}/images/2026/gman-vase.png)

RenderMan is the interface Pixar published for turning a 3D scene description into an image: cameras, geometry, lights and shaders, all in a plain-text RIB file. It's the API behind decades of film rendering, but the implementations that speak it are proprietary, heavyweight, or both.

[GMAN](https://github.com/jac18281828/gman) is a from-scratch, RenderMan-compatible renderer: point it at a `.rib` file, get a picture. No studio license, no black box — a real object → world → camera → screen → NDC → raster pipeline with analytic normals, backface culling and z-buffering, real lighting (`ambientlight`, `distantlight`, `pointlight`) and real C++ surface shaders (`matte`, `plastic`, `metal`), writing TIFF, PNG, JPEG or PNM.

It's small enough to read end to end and modern enough to build with one CMake preset and a C++23 compiler. If you want to see how a REYES-era renderer actually turns geometry into pixels, or just want something RenderMan-shaped you can run and inspect yourself, this is it.

### Build and install

Needs CMake 3.25 or newer, a C++23 compiler (clang 16+ or gcc 13+), libtiff, libpng and zlib. POSIX only: macOS and Linux. A VS Code devcontainer is included.

```sh
git clone https://github.com/jac18281828/gman.git
cd gman
cmake --preset dev
cmake --build build --parallel
```

### Render your first scene

A RIB file is plain text. Save this as `sphere.rib`:

```
Display "sphere.tif" "file" "rgba"
Format 640 480 1
Projection "perspective" "fov" [45]
Translate 0 0 5
WorldBegin
Sphere 1 -1 1 360
WorldEnd
```

Then render it:

```sh
./build/gman sphere.rib
```

`sphere.tif` lands next to it.

### Where to find it

[GitHub](https://github.com/jac18281828/gman)

### History

GMAN started in 1999, was shelved in 2002, and came back in 2026 on a CMake / C++23 build. The repository is public, licensed [LGPL-2.1-or-later](https://github.com/jac18281828/gman).
