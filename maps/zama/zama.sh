#!/usr/bin/env bash
# Zama, 202 BCE: a close perspective view of the Tunisian interior. Runs in jac18281828/bedrock (GMT 6).
set -euo pipefail
cd /work
ETOPO=/bedrock/ETOPO_2022_v1_30s_N90W180_surface.nc
GRID=out/etopo_tunisia.nc
[ -f "$GRID" ] || gmt grdcut "$ETOPO" -R0/20/28/44 -G"$GRID"

LON=9.4; LAT=36.0
J=G${LON}/${LAT}/16c+z${ALT:-700}+v${VIEW:-32}/${VIEW:-32}

cat > out/relief.cpt <<CPT
-8000 120/138/128 -2000 160/172/155
-2000 160/172/155 0 196/202/178
0 226/214/178 300 214/196/150
300 214/196/150 800 190/164/116
800 190/164/116 1500 160/128/86
1500 160/128/86 3000 120/96/66
B 120/138/128
F 120/96/66
N 200/200/200
CPT
gmt grdgradient "$GRID" -A315 -Nt0.8 -Gout/shade.nc

gmt begin out/zama png,pdf
  gmt set MAP_FRAME_PEN 1p,90/70/45 MAP_GRID_PEN_PRIMARY 0.25p,110/90/60 PS_PAGE_COLOR 244/236/216
  gmt grdimage "$GRID" -R0/20/28/44 -J$J -Cout/relief.cpt -Iout/shade.nc -B0g1
  gmt coast -S170/180/162 -t35 -Df -A50/0/1
  gmt coast -Df -A50/0/1 -W1/0.4p,90/70/45 -I1/0.6p,110/130/125 -I2/0.4p,110/130/125
  gmt plot place_pts.txt -Sc0.18c -G45/28/12 -W0.5p,244/236/216
  gmt text places.txt -F+f13p,Times-BoldItalic,25/14/6+j -Dj0.3c/0
  gmt plot battle.txt -Skbattle/1.0c -G95/18/10
  echo 8.55 36.10 Zama | gmt text -F+f20p,Times-Bold,25/14/6+jCT -D0/-0.55c
  echo 8.55 36.10 '(202 BCE)' | gmt text -F+f15p,Times-Bold,25/14/6+jCT -D0/-1.25c
gmt end
