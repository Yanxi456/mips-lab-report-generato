---
name: lab-report-generator
description: "Generate formatted lab reports (实验报告) from experiment documents, lecture PPTs, circuit files, and templates. Use this skill when the user wants to: create a lab report based on a template; convert experiment documentation into a formatted DOCX; generate reports for computer organization (计组), digital logic (数电), or similar engineering lab courses; process .circ circuit files and .pptx lecture slides into report content. Trigger when user mentions '实验报告', 'lab report', '实验模板', or wants to create a report from experiment materials. Also trigger when user has a template DOCX and wants to fill it with content from PPT/PDF/circuit files."
---

# Lab Report Generator

Generate professional, well-formatted lab reports (实验报告) by combining content from multiple source files.

## Overview

This skill automates the process of creating lab reports by:
1. **Analyzing input files** - template, experiment document, lecture PPT, circuit files
2. **Extracting content** - text, tables, diagrams from various sources
3. **Structuring content** - organizing into standard report sections
4. **Generating output** - formatted DOCX with proper typography and layout

## Input File Types

| File Type | Purpose | Extraction Method |
|-----------|---------|-------------------|
| `.docx` (template) | Report structure and formatting | Unpack XML, analyze structure |
| `.docx` (experiment doc) | Experiment requirements and instructions | python-docx or XML parsing |
| `.pptx` (lecture slides) | Theory, diagrams, tables | python-pptx |
| `.circ` (Logisim circuits) | Circuit design details | XML parsing |
| `.pdf` (reference docs) | Additional context | pypdf or pdfplumber |

## Standard Report Structure

Based on Chinese university lab report conventions:

```
封面页 (Cover Page)
├── 校徽/学校标识 (School Logo)
├── 实验报告 (Title)
├── 课程名称 (Course Name)
├── 学生姓名 (Student Name)
└── 学号 (Student ID)

正文页 (Content Pages)
├── 一、实验项目名称 (Experiment Title)
├── 二、实验原理 (Theory & Principles)
│   ├── 概念说明 (Concept Explanation)
│   ├── 原理图/公式 (Diagrams/Formulas)
│   └── 关键数据表 (Key Data Tables)
├── 三、实验步骤 (Experiment Steps)
│   ├── 步骤1, 2, 3... (Numbered Steps)
│   └── 电路截图/流程图 (Circuit Screenshots/Flowcharts)
├── 四、实验结果 (Results)
│   ├── 测试数据 (Test Data)
│   ├── 结果截图 (Result Screenshots)
│   └── 结果分析 (Analysis)
└── 五、总结体会 (Reflection & Summary)
```

## Workflow

### Phase 1: File Discovery and Analysis

1. **Scan working directory** for input files:
   - Template: Look for `*模板*.docx`, `*template*.docx`
   - Experiment doc: Look for `*实验*.docx`, `*文档*.docx`
   - PPT: Look for `*.pptx` files
   - Circuit: Look for `*.circ` files
   - Any PDF files for additional reference

2. **Read template structure**:
   ```
   python scripts/office/unpack.py template.docx unpacked_template/
   ```
   Analyze `word/document.xml` to understand:
   - Cover page layout (logo, title, fields)
   - Section headers and numbering
   - Font styles and sizes
   - Page margins and dimensions

3. **Extract experiment requirements** from experiment document

4. **Extract lecture content** from PPT slides

5. **Analyze circuit files** for technical details

### Phase 2: Content Extraction

#### From PPT Files
```python
# Use python-pptx for reliable extraction
from pptx import Presentation

def extract_ppt_content(pptx_path):
    prs = Presentation(pptx_path)
    slides_content = []
    for i, slide in enumerate(prs.slides):
        slide_text = []
        for shape in slide.shapes:
            if shape.has_text_frame:
                for para in shape.text_frame.paragraphs:
                    text = para.text.strip()
                    if text:
                        slide_text.append(text)
        slides_content.append({
            'slide_num': i + 1,
            'content': slide_text
        })
    return slides_content
```

#### From DOCX Files
```python
# Extract text from DOCX
import zipfile
import re

def extract_docx_text(docx_path):
    with zipfile.ZipFile(docx_path, 'r') as z:
        with z.open('word/document.xml') as f:
            content = f.read().decode('utf-8')
            texts = re.findall(r'>([^<]+)</w:t>', content)
            return [t.strip() for t in texts if t.strip() and len(t.strip()) > 1]
```

#### From Circuit Files (.circ)
```python
# Parse Logisim circuit XML
import xml.etree.ElementTree as ET

def extract_circuit_info(circ_path):
    tree = ET.parse(circ_path)
    root = tree.getroot()

    circuits = []
    for circuit in root.findall('circuit'):
        circuit_name = circuit.get('name')
        # Extract components, wires, labels
        components = []
        for comp in circuit.findall('comp'):
            comp_lib = comp.get('lib')
            comp_name = comp.get('name')
            # Get component attributes
            attrs = {a.get('name'): a.get('val') for a in comp.findall('a')}
            components.append({
                'lib': comp_lib,
                'name': comp_name,
                'attrs': attrs
            })
        circuits.append({
            'name': circuit_name,
            'components': components
        })
    return circuits
```

### Phase 3: Report Generation

Use `docx-js` (Node.js) to generate the DOCX file. Key principles:

1. **Font Standards**:
   - Body text: 宋体 (SimSun), 小四 (12pt = 24 half-points)
   - Section titles: 宋体, 小三 (14pt = 28 half-points), Bold
   - Cover title: 楷体 (KaiTi), 36pt = 72 half-points, Bold
   - Header/Footer: 宋体, 小五 (9pt = 18 half-points)

2. **Spacing Standards**:
   - Line spacing: 1.5x (360 twips)
   - Paragraph spacing: Before 240, After 120 for titles
   - First line indent: 2 characters (480 twips)

3. **Page Setup**:
   - Paper size: A4 (11906 x 16838 DXA)
   - Margins: Top 1440, Bottom 1440, Left 1800, Right 1800

4. **Image Placeholders**:
   - Use red text for placeholder comments
   - Format: `【此处需要插入XXX图】`
   - Include figure numbering: `图1 XXX示意图`

### Phase 4: Validation

After generating the report:
1. Validate DOCX structure
2. Check Chinese character encoding
3. Verify table formatting
4. Confirm image placeholder markers are present

## Output Requirements

### File Naming Convention
```
{实验名称}_实验报告.docx
```
Example: `实验三_寄存器堆与控制器_实验报告.docx`

### Quality Checklist
- [ ] Cover page has all required fields
- [ ] Section numbering is consistent
- [ ] Body text uses 宋体 小四
- [ ] Tables are properly formatted with borders
- [ ] Image placeholders are clearly marked in red
- [ ] Page breaks separate major sections
- [ ] Header/footer present on content pages
- [ ] No orphaned lines or awkward page breaks

## Common Patterns

### Creating Tables
```javascript
const border = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };

new Table({
    width: { size: 8306, type: WidthType.DXA },
    columnWidths: [1200, 1500, 2000, ...],
    rows: [
        new TableRow({
            children: [
                new TableCell({
                    borders,
                    width: { size: 1200, type: WidthType.DXA },
                    shading: { fill: "D9E2F3", type: ShadingType.CLEAR },
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Header", bold: true })]
                    })]
                }),
                // more cells...
            ]
        }),
        // more rows...
    ]
})
```

### Adding Image Placeholders
```javascript
new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240 },
    children: [
        new TextRun({
            text: "【此处需要插入XXX图】",
            font: { eastAsia: "宋体" },
            size: 24,
            color: "FF0000",
            bold: true
        })
    ]
})
```

## Troubleshooting

### Issue: Chinese characters garbled in output
- Ensure all strings use proper encoding
- Use `font: { eastAsia: "宋体" }` for Chinese text
- Avoid mixing encoding in XML generation

### Issue: Table borders not showing
- Set borders on BOTH table AND individual cells
- Use `WidthType.DXA` not `WidthType.PERCENTAGE`

### Issue: Logo image not appearing
- Verify image file exists in template
- Check rId relationship in document.xml.rels
- Ensure image type matches extension (png/jpg)

## Scripts Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/extract_ppt.py` | Extract PPT content | `python extract_ppt.py file.pptx` |
| `scripts/extract_docx.py` | Extract DOCX content | `python extract_docx.py file.docx` |
| `scripts/extract_circuit.py` | Parse circuit files | `python extract_circuit.py file.circ` |
| `scripts/generate_report.js` | Generate DOCX report | `node generate_report.js` |
| `scripts/validate.py` | Validate output DOCX | `python validate.py file.docx` |

## References

- `references/formatting_guide.md` - Detailed formatting specifications
- `references/report_templates.md` - Common report section templates
- `templates/` - Sample template files for different course types
