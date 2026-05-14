#!/usr/bin/env python3
"""
Extract information from Logisim circuit (.circ) files.
Provides details about circuits, components, and connections.

Usage:
    python extract_circuit.py <file.circ> [--output json|text] [--circuit NAME]
"""

import sys
import json
import argparse
import xml.etree.ElementTree as ET
from pathlib import Path
from collections import defaultdict


def parse_circ_file(file_path):
    """
    Parse a Logisim .circ file and extract circuit information.

    Args:
        file_path: Path to the .circ file

    Returns:
        Dictionary with circuit information
    """
    tree = ET.parse(file_path)
    root = tree.getroot()

    result = {
        'source': root.get('source', 'unknown'),
        'version': root.get('version', 'unknown'),
        'main_circuit': None,
        'libraries': [],
        'circuits': []
    }

    # Get main circuit name
    main_elem = root.find('main')
    if main_elem is not None:
        result['main_circuit'] = main_elem.get('name')

    # Parse libraries
    for lib in root.findall('lib'):
        lib_info = {
            'desc': lib.get('desc', ''),
            'name': lib.get('name', ''),
            'tools': []
        }
        for tool in lib.findall('tool'):
            tool_info = {
                'name': tool.get('name', ''),
                'attributes': {}
            }
            for attr in tool.findall('a'):
                tool_info['attributes'][attr.get('name', '')] = attr.get('val', '')
            lib_info['tools'].append(tool_info)
        result['libraries'].append(lib_info)

    # Parse circuits
    for circuit in root.findall('circuit'):
        circuit_info = parse_circuit(circuit)
        result['circuits'].append(circuit_info)

    return result


def parse_circuit(circuit_elem):
    """Parse a single circuit element."""
    circuit_name = circuit_elem.get('name', 'unknown')

    circuit_info = {
        'name': circuit_name,
        'attributes': {},
        'components': [],
        'wires': [],
        'tunnels': [],
        'pins': [],
        'labels': []
    }

    # Parse circuit attributes
    for attr in circuit_elem.findall('a'):
        circuit_info['attributes'][attr.get('name', '')] = attr.get('val', '')

    # Parse components
    for comp in circuit_elem.findall('comp'):
        comp_info = parse_component(comp)
        circuit_info['components'].append(comp_info)

        # Categorize special components
        if comp_info['name'] == 'Tunnel':
            circuit_info['tunnels'].append(comp_info)
        elif comp_info['name'] == 'Pin':
            circuit_info['pins'].append(comp_info)
        elif comp_info['name'] == 'Text':
            circuit_info['labels'].append(comp_info)

    # Parse wires
    for wire in circuit_elem.findall('wire'):
        wire_info = {
            'from': wire.get('from', ''),
            'to': wire.get('to', '')
        }
        circuit_info['wires'].append(wire_info)

    return circuit_info


def parse_component(comp_elem):
    """Parse a single component element."""
    comp_info = {
        'lib': comp_elem.get('lib', ''),
        'name': comp_elem.get('name', ''),
        'location': comp_elem.get('loc', ''),
        'attributes': {}
    }

    for attr in comp_elem.findall('a'):
        attr_name = attr.get('name', '')
        attr_val = attr.get('val', '')
        comp_info['attributes'][attr_name] = attr_val

    return comp_info


def get_component_summary(circuit_info):
    """Generate a summary of components in a circuit."""
    summary = defaultdict(int)
    for comp in circuit_info['components']:
        summary[comp['name']] += 1
    return dict(summary)


def get_pin_info(circuit_info):
    """Extract pin information from a circuit."""
    pins = {
        'inputs': [],
        'outputs': []
    }

    for pin in circuit_info['pins']:
        attrs = pin['attributes']
        pin_info = {
            'label': attrs.get('label', 'unnamed'),
            'width': attrs.get('width', '1'),
            'location': pin['location']
        }

        if attrs.get('output', 'false') == 'true':
            pins['outputs'].append(pin_info)
        else:
            pins['inputs'].append(pin_info)

    return pins


def format_text_output(circuit_data):
    """Format circuit data as readable text."""
    output = []

    output.append(f"Circuit File Analysis")
    output.append(f"{'='*60}")
    output.append(f"Source: {circuit_data['source']}")
    output.append(f"Version: {circuit_data['version']}")
    output.append(f"Main Circuit: {circuit_data['main_circuit']}")
    output.append(f"Total Circuits: {len(circuit_data['circuits'])}")

    for circuit in circuit_data['circuits']:
        output.append(f"\n{'='*60}")
        output.append(f"Circuit: {circuit['name']}")
        output.append(f"{'='*60}")

        # Component summary
        summary = get_component_summary(circuit)
        output.append(f"\nComponents ({sum(summary.values())} total):")
        for comp_name, count in sorted(summary.items()):
            output.append(f"  - {comp_name}: {count}")

        # Pin information
        pins = get_pin_info(circuit)
        if pins['inputs']:
            output.append(f"\nInput Pins ({len(pins['inputs'])}):")
            for pin in pins['inputs']:
                output.append(f"  - {pin['label']} ({pin['width']}-bit)")
        if pins['outputs']:
            output.append(f"\nOutput Pins ({len(pins['outputs'])}):")
            for pin in pins['outputs']:
                output.append(f"  - {pin['label']} ({pin['width']}-bit)")

        # Tunnel information
        if circuit['tunnels']:
            output.append(f"\nTunnels ({len(circuit['tunnels'])}):")
            for tunnel in circuit['tunnels']:
                label = tunnel['attributes'].get('label', 'unnamed')
                width = tunnel['attributes'].get('width', '1')
                output.append(f"  - {label} ({width}-bit)")

        # Labels
        if circuit['labels']:
            output.append(f"\nText Labels:")
            for label in circuit['labels']:
                text = label['attributes'].get('text', '')
                if text:
                    output.append(f"  - {text}")

    return '\n'.join(output)


def main():
    parser = argparse.ArgumentParser(description='Extract information from Logisim circuit files')
    parser.add_argument('file', help='Path to .circ file')
    parser.add_argument('--output', choices=['json', 'text'], default='text',
                        help='Output format (default: text)')
    parser.add_argument('--circuit', help='Extract specific circuit by name')
    parser.add_argument('--encoding', default='utf-8', help='Output encoding')

    args = parser.parse_args()

    if not Path(args.file).exists():
        print(f"Error: File not found: {args.file}")
        sys.exit(1)

    try:
        circuit_data = parse_circ_file(args.file)

        # Filter to specific circuit if requested
        if args.circuit:
            filtered = [c for c in circuit_data['circuits'] if c['name'] == args.circuit]
            if not filtered:
                print(f"Error: Circuit '{args.circuit}' not found")
                print(f"Available circuits: {[c['name'] for c in circuit_data['circuits']]}")
                sys.exit(1)
            circuit_data['circuits'] = filtered

        if args.output == 'json':
            print(json.dumps(circuit_data, ensure_ascii=False, indent=2))
        else:
            print(format_text_output(circuit_data))

    except Exception as e:
        print(f"Error parsing circuit file: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
