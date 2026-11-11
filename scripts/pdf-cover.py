"""Render page 1 of a PDF to a PNG for archive document covers.

    python scripts/pdf-cover.py input.pdf output.png 1600
"""
import sys

import pymupdf as fitz

source, target, width = sys.argv[1], sys.argv[2], int(sys.argv[3])
doc = fitz.open(source)
page = doc[0]
zoom = width / page.rect.width
page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False).save(target)
