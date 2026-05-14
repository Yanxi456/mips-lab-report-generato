#!/usr/bin/env python3
"""
Extract text content from Word (.docx) files.
Handles Chinese character encoding properly.

Usage:
    python extract_docx.py <file.docx> [--output json|text] [--section N]
"""

import sys
import json
import argparse
import zipfile
import re
from pathlib import Path


def extract_docx_text(file_path):
    """
    Extract all text from a DOCX file.

    Args:
        file_path: Path to the .docx file

    Returns:
        List of text paragraphs
    """
    with zipfile.ZipFile(file_path, 'r') as z:
        with z.open('word/document.xml') as f:
            content = f.read().decode('utf-8')

            # Extract text between w:t tags
            texts = re.findall(r'>([^<]+)</w:t>', content)

            # Clean and filter
            cleaned = []
            for t in texts:
                t = t.strip()
                if t and len(t) > 0:
                    cleaned.append(t)

            return cleaned


def extract_docx_structure(file_path):
    """
    Extract document structure (headings, paragraphs) from a DOCX file.

    Returns:
        Dictionary with document structure information
    """
    with zipfile.ZipFile(file_path, 'r') as z:
        with z.open('word/document.xml') as f:
            content = f.read().decode('utf-8')

            # Extract paragraphs with their styles
            paragraphs = []

            # Find all w:p elements
            p_pattern = r'<w:p[^>]*>(.*?)</w:p>'
            p_matches = re.findall(p_pattern, content, re.DOTALL)

            for p_content in p_matches:
                # Check for heading style
                style_match = re.search(r'<w:pStyle w:val="([^"]+)"/>', p_content)
                style = style_match.group(1) if style_match else 'Normal'

                # Extract text
                texts = re.findall(r'>([^<]+)</w:t>', p_content)
                text = ''.join(texts).strip()

                if text:
                    paragraphs.append({
                        'style': style,
                        'text': text
                    })

            return paragraphs


def extract_docx_tables(file_path):
    """
    Extract tables from a DOCX file.

    Returns:
        List of tables (each table is a list of rows)
    """
    with zipfile.ZipFile(file_path, 'r') as z:
        with z.open('word/document.xml') as f:
            content = f.read().decode('utf-8')

            tables = []

            # Find all w:tbl elements
            tbl_pattern = r'<w:tbl[^>]*>(.*?)</w:tbl>'
            tbl_matches = re.findall(tbl_pattern, content, re.DOTALL)

            for tbl_content in tbl_matches:
                table = []

                # Find all w:tr elements (rows)
                tr_pattern = r'<w:tr[^>]*>(.*?)</w:tr>'
                tr_matches = re.findall(tr_pattern, tbl_content, re.DOTALL)

                for tr_content in tr_matches:
                    row = []

                    # Find all w:tc elements (cells)
                    tc_pattern = r'<w:tc[^>]*>(.*?)</w:tc>'
                    tc_matches = re.findall(tc_pattern, tr_content, re.DOTALL)

                    for tc_content in tc_matches:
                        # Extract text from cell
                        texts = re.findall(r'>([^<]+)</w:t>', tc_content)
                        cell_text = ''.join(texts).strip()
                        row.append(cell_text)

                    table.append(row)

                if table:
                    tables.append(table)

            return tables


def format_text_output(paragraphs):
    """Format paragraphs as readable text."""
    output = []
    for para in paragraphs:
        if para['style'].startswith('Heading'):
            level = para['style'].replace('Heading', '')
            prefix = '#' * int(level) if level.isdigit() else '#'
            output.append(f"\n{prefix} {para['text']}")
        else:
            output.append(para['text'])
    return '\n'.join(output)


def main():
    parser = argparse.ArgumentParser(description='Extract content from DOCX files')
    parser.add_argument('file', help='Path to .docx file')
    parser.add_argument('--output', choices=['json', 'text', 'structure', 'tables'],
                        default='text', help='Output format (default: text)')
    parser.add_argument('--encoding', default='utf-8', help='Output encoding')

    args = parser.parse_args()

    if not Path(args.file).exists():
        print(f"Error: File not found: {args.file}")
        sys.exit(1)

    try:
        if args.output == 'structure':
            content = extract_docx_structure(args.file)
            print(json.dumps(content, ensure_ascii=False, indent=2))
        elif args.output == 'tables':
            tables = extract_docx_tables(args.file)
            print(json.dumps(tables, ensure_ascii=False, indent=2))
        elif args.output == 'json':
            content = extract_docx_text(args.file)
            print(json.dumps(content, ensure_ascii=False, indent=2))
        else:
            content = extract_docx_text(args.file)
            for text in content:
                print(text)

    except Exception as e:
        print(f"Error extracting content: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
