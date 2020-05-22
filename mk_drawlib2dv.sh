cat drawlib.js draw.js coords.js window.js group.js items.js items_rect.js items_ellipse.js items_text.js items_image.js items_polyline.js items_freehand.js items_polygon.js  background.js >drawlib2dv_debug.js.min
python jsmin.py <drawlib2dv_debug.js.min >drawlib2dv1.js.min
cat copyright.js drawlib2dv1.min.js >drawlib2dv.min.js
rm drawlib2dv1.js.min
python ext_comments.py >documentation.txt

