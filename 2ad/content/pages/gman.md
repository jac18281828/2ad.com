title: GMAN — a RenderMan-Compatible Renderer
slug: gman
category: tech
date: 2026-09-06
summary: A clean-room RenderMan-compatible renderer, revived in 2026 after twenty-four years shelved.

![GMAN is at it again!]({static}/images/2026/gman-vase.png)

[GMAN](https://github.com/jac18281828/gman) reads RenderMan Interface Bytestream (RIB) scene files and writes images. RenderMan is Pixar's published interface specification; GMAN is a clean-room implementation of it. RenderMan is a registered trademark of Pixar; GMAN is not associated with or endorsed by Pixar.

### History

GMAN started in 1999, was shelved in 2002, and came back in 2026 on a CMake / C++23 build. The repository is public, licensed [LGPL-2.1-or-later](https://github.com/jac18281828/gman).

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

The [repository](https://github.com/jac18281828/gman) and its README track what GMAN supports — check there, not here.
