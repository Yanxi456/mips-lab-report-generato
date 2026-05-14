# Formatting Guide for Lab Reports

This document provides detailed formatting specifications for Chinese university lab reports.

## Typography Standards

### Font Families

| Usage | Font | Notes |
|-------|------|-------|
| Body text | 宋体 (SimSun) | Standard Chinese serif font |
| Cover title | 楷体 (KaiTi) | Formal calligraphic style |
| Section headings | 宋体 (SimSun) | Bold weight |
| English/numbers | Times New Roman | For technical content |
| Code/variables | Consolas or Courier New | For circuit signals, code |

### Font Sizes

| Name | Chinese Name | Points | Half-points (docx) | Usage |
|------|-------------|--------|-------------------|-------|
| 一号 | 初号 | 26pt | 52 | Main titles |
| 小一 | | 24pt | 48 | |
| 二号 | | 22pt | 44 | |
| 小二 | | 18pt | 36 | Cover subtitle |
| 三号 | | 16pt | 32 | |
| 小三 | | 14pt | 28 | Section titles |
| 四号 | | 12pt | 24 | |
| 小四 | | 12pt | 24 | **Body text (default)** |
| 五号 | | 10.5pt | 21 | Table content |
| 小五 | | 9pt | 18 | Headers, footers |

### Line Spacing

| Type | Value | Usage |
|------|-------|-------|
| 1.0 | 240 twips | Single spacing |
| 1.5 | 360 twips | **Body text (default)** |
| 2.0 | 480 twips | Double spacing |
| Fixed | 280-320 twips | Tables with dense content |

### Paragraph Spacing

| Element | Before | After | Notes |
|---------|--------|-------|-------|
| Section title | 240 | 120 | More space before |
| Subsection title | 180 | 120 | |
| Body paragraph | 0 | 0 | Use line spacing instead |
| Table caption | 240 | 120 | Centered |
| Image placeholder | 240 | 240 | |

## Page Layout

### Paper Size

| Format | Width | Height | DXA Width | DXA Height |
|--------|-------|--------|-----------|------------|
| A4 | 210mm | 297mm | 11906 | 16838 |
| Letter | 8.5" | 11" | 12240 | 15840 |

### Margins (A4)

| Edge | Millimeters | DXA | Notes |
|------|-------------|-----|-------|
| Top | 25.4mm | 1440 | 1 inch |
| Bottom | 25.4mm | 1440 | 1 inch |
| Left | 31.75mm | 1800 | 1.25 inch (binding) |
| Right | 31.75mm | 1800 | 1.25 inch |

### First Line Indent

- Standard: 2 Chinese characters (480 DXA)
- Alternative: 480 DXA for body paragraphs

## Table Formatting

### Border Style

```javascript
const border = {
    style: BorderStyle.SINGLE,
    size: 1,      // 1/8 point
    color: "000000"
};
```

### Cell Padding

```javascript
const cellMargins = {
    top: 60,      // ~1mm
    bottom: 60,
    left: 80,     // ~1.4mm
    right: 80
};
```

### Header Row Styling

- Background: Light blue (#D9E2F3)
- Text: Bold, centered
- Font size: 五号 (10.5pt) or 小四 (12pt)

### Data Row Styling

- Background: White
- Text: Normal, centered
- Font size: 五号 (10.5pt)

## Image Placement

### Figure Captions

- Position: Below figure, centered
- Format: "图N 描述文字"
- Font: 宋体 五号

### Table Captions

- Position: Above table, centered
- Format: "表N 描述文字"
- Font: 宋体 五号

### Image Placeholders

When images need to be manually inserted:

```
【此处需要插入XXX图】  (Red, bold, centered)
图N XXX示意图          (Normal, centered)
```

## Section Numbering

### Standard Sections

```
一、实验项目名称
二、实验原理
三、实验步骤
四、实验结果
五、总结体会
```

### Subsections

```
1. XXX (under section)
   (1) XXX (detail)
   (2) XXX (detail)
```

## Headers and Footers

### Header

- Content: Report title or course name
- Font: 宋体 小五 (9pt)
- Color: Gray (#808080)
- Alignment: Center

### Footer

- Content: "第 X 页"
- Font: 宋体 小五 (9pt)
- Alignment: Center

## Special Characters

### Chinese Punctuation

| Character | Unicode | Usage |
|-----------|---------|-------|
| ， | U+FF0C | Comma |
| 。 | U+3002 | Period |
| ； | U+FF1B | Semicolon |
| ： | U+FF1A | Colon |
| （ | U+FF08 | Left paren |
| ） | U+FF09 | Right paren |
| 《 | U+300A | Left book title |
| 》 | U+300B | Right book title |
| 「 | U+300C | Left corner bracket |
| 」 | U+300D | Right corner bracket |

### Smart Quotes in XML

```xml
&#x201C;  →  " (left double)
&#x201D;  →  " (right double)
&#x2018;  →  ' (left single)
&#x2019;  →  ' (right single / apostrophe)
```

## DXA Conversion Reference

| Measurement | DXA Value | Notes |
|-------------|-----------|-------|
| 1 inch | 1440 | Standard unit |
| 1 cm | 567 | Metric conversion |
| 1 mm | 56.7 | |
| 1 point | 20 | Font size unit |
| 1 twip | 1 | Smallest unit |

### Common Conversions

- 12pt = 240 DXA (for font size)
- 1.5 line spacing = 360 DXA
- 2 character indent = 480 DXA
- 1 inch margin = 1440 DXA

## Color Palette

### Standard Colors

| Usage | Hex | RGB |
|-------|-----|-----|
| Black text | #000000 | 0,0,0 |
| Gray text | #808080 | 128,128,128 |
| Header background | #D9E2F3 | 217,226,243 |
| Placeholder text | #FF0000 | 255,0,0 |
| Link blue | #0563C1 | 5,99,193 |

## File Naming Conventions

### Output Files

```
{实验编号}_{实验名称}_实验报告.docx
```

Examples:
- `实验三_寄存器堆与控制器_实验报告.docx`
- `Lab03_RegisterFile_Controller_Report.docx`

### Temporary Files

```
unpacked_{original_name}/     - Unpacked DOCX
create_report.js              - Generation script
```
