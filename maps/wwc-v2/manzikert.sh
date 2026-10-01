#!/usr/bin/env bash
# Byzantine and Seljuk globe, 1071 CE. Runs inside jac18281828/bedrock (GMT 6).
set -euo pipefail
cd /work
ETOPO=/bedrock/ETOPO_2022_v1_30s_N90W180_surface.nc
GRID=out/etopo_6m.nc
[ -f "$GRID" ] || gmt grdsample "$ETOPO" -I6m -R-180/180/-90/90 -G"$GRID"

LON=42.54; LAT=39.14
J=G${LON}/${LAT}/16c+z2500

# old-world palette: grey-green sea, parchment land
cat > out/relief.cpt <<CPT
-8000 120/138/128 -2000 160/172/155
-2000 160/172/155 0 196/202/178
0 226/214/178 500 214/196/150
500 214/196/150 1500 190/164/116
1500 190/164/116 3000 160/128/86
3000 160/128/86 6000 120/96/66
B 120/138/128
F 120/96/66
N 200/200/200
CPT
gmt grdgradient "$GRID" -A315 -Nt0.6 -Gout/shade.nc

gmt begin out/manzikert png,pdf
  gmt set MAP_FRAME_PEN 1p,90/70/45 MAP_GRID_PEN_PRIMARY 0.25p,110/90/60 \
          FONT_TAG 10p,Times-Italic,70/50/30 PS_PAGE_COLOR 244/236/216
  gmt grdimage "$GRID" -R-180/180/-90/90 -J$J -Cout/relief.cpt -Iout/shade.nc -B0g15
  # wash the kingdoms over land only
  gmt coast -S170/180/162 -t35 -Di -A500/0/1
  gmt coast -Gc -Di -A500/0/1
  gmt plot realms.gmt -G176/140/96 -t60 -W0.5p,140/105/70
  gmt plot frontier.gmt -G214/96/32 -t45 -W0.6p,170/60/20
  gmt coast -Q
  gmt coast -Di -A500/0/1 -W1/0.3p,90/70/45
  gmt text labels.txt -F+f15p,Times-Bold,45/28/12+jCM
  gmt plot cities.txt -Sc0.16c -G45/28/12 -W0.5p,244/236/216
  gmt text cities.txt -F+f12p,Times-BoldItalic,45/28/12+j -Dj0.3c/0
  gmt plot battles.txt -Skbattle/1.0c -G95/18/10
  echo 42.54 39.14 Manzikert | gmt text -F+f20p,Times-Bold,25/14/6+jLB -D0.55c/0.02c
  echo 42.54 39.14 '(1071 CE)' | gmt text -F+f15p,Times-Bold,25/14/6+jLT -D0.55c/-0.08c
gmt end
