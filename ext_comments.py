# Script to extract documentation comments from a set of Javascript files.
# This script was created because the particular namespace technique
# confuses more normal Javadoc tools. The output from this script is
# less sophisticated than from other tools

divider = '=========='

def process_one_file( filename ):
    in_comm = False
    in_file = open(filename, 'r')
    for in_line in in_file:
        if not in_comm: # Check for start of comment block
            if in_line.strip().startswith('/**'):
                in_comm = True
                in_line = in_line.strip()
                in_line = in_line[3:].strip()
                # Fall through and process the rest of the line.
                # A comment block could be a single line
        if in_comm:
             out_line = in_line.rstrip()
             # Check for end of comment
             end_comm = in_line.find('*/')
             if end_comm >= 0:
                 in_comm = False
                 out_line = in_line[0:end_comm]
             # Strip leading *
             if out_line.lstrip().startswith('*'):
                 out_line = out_line.lstrip()[1:]
             print out_line
             # If end of block then divide
             if not in_comm: print divider
    in_file.close()
    
#====================================================================
# Main
file_list = ['drawlib.js', 'coords.js', 'window.js', 'draw.js',
    'items.js', 'group.js',
    'items_rect.js', 'items_ellipse.js', 'items_text.js', 'items_image.js',
    'items_polyline.js', 'items_freehand.js', 'items_polygon.js']
for one_filename in file_list:
    process_one_file(one_filename)
