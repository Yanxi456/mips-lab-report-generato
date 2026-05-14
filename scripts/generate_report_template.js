/**
 * Lab Report Generator Template
 *
 * This is a template script for generating formatted lab reports using docx-js.
 * Customize the content sections based on your specific experiment.
 *
 * Usage:
 *   node generate_report_template.js
 *
 * Requirements:
 *   - npm install -g docx
 *   - Set NODE_PATH if using global installation
 */

const fs = require('fs');
const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    Header, Footer, AlignmentType, LevelFormat,
    HeadingLevel, BorderStyle, WidthType, ShadingType,
    PageNumber, PageBreak, ImageRun
} = require('docx');

// ============================================================
// CONFIGURATION - Customize these values for your report
// ============================================================

const CONFIG = {
    // Output file path
    outputPath: './实验报告.docx',

    // Template settings
    template: {
        logoPath: null,  // Path to school logo image (optional)
        courseName: '计组实验',
        experimentName: '实验名称',
        studentName: '',  // Leave empty for user to fill
        studentId: '',    // Leave empty for user to fill
    },

    // Page settings (A4)
    page: {
        width: 11906,
        height: 16838,
        margin: {
            top: 1440,
            right: 1800,
            bottom: 1440,
            left: 1800
        }
    },

    // Font settings
    fonts: {
        body: '宋体',
        title: '楷体',
        heading: '宋体'
    },

    // Size settings (in half-points)
    sizes: {
        coverTitle: 72,    // 36pt
        sectionTitle: 28,  // 14pt (小三)
        body: 24,          // 12pt (小四)
        caption: 20,       // 10pt (五号)
        header: 18         // 9pt (小五)
    }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Create a text run with standard body formatting
 */
function bodyText(text, options = {}) {
    return new TextRun({
        text: text,
        font: { eastAsia: CONFIG.fonts.body },
        size: CONFIG.sizes.body,
        ...options
    });
}

/**
 * Create a section title paragraph
 */
function sectionTitle(text) {
    return new Paragraph({
        spacing: { before: 240, after: 120, line: 360 },
        children: [
            new TextRun({
                text: text,
                font: { eastAsia: CONFIG.fonts.heading },
                size: CONFIG.sizes.sectionTitle,
                bold: true
            })
        ]
    });
}

/**
 * Create a subsection title
 */
function subsectionTitle(text) {
    return new Paragraph({
        spacing: { before: 180, after: 120, line: 360 },
        children: [
            new TextRun({
                text: text,
                font: { eastAsia: CONFIG.fonts.body },
                size: CONFIG.sizes.body,
                bold: true
            })
        ]
    });
}

/**
 * Create a body paragraph with first-line indent
 */
function bodyParagraph(text, options = {}) {
    return new Paragraph({
        spacing: { line: 360 },
        indent: { firstLine: 480 },
        children: [bodyText(text)],
        ...options
    });
}

/**
 * Create a body paragraph without indent
 */
function bodyParagraphNoIndent(text, options = {}) {
    return new Paragraph({
        spacing: { line: 360 },
        children: [bodyText(text)],
        ...options
    });
}

/**
 * Create an image placeholder paragraph
 */
function imagePlaceholder(description, figureNum) {
    return [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 240 },
            children: [
                new TextRun({
                    text: `【此处需要插入${description}】`,
                    font: { eastAsia: CONFIG.fonts.body },
                    size: CONFIG.sizes.body,
                    color: 'FF0000',
                    bold: true
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
                bodyText(`图${figureNum} ${description}`)
            ]
        })
    ];
}

/**
 * Create a table caption
 */
function tableCaption(text) {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 120 },
        children: [bodyText(text)]
    });
}

/**
 * Create a standard table with borders
 */
function createTable(headers, rows, columnWidths) {
    const border = { style: BorderStyle.SINGLE, size: 1, color: '000000' };
    const borders = { top: border, bottom: border, left: border, right: border };
    const cellMargins = { top: 60, bottom: 60, left: 80, right: 80 };

    const totalWidth = columnWidths.reduce((a, b) => a + b, 0);

    function headerCell(text, width) {
        return new TableCell({
            borders,
            width: { size: width, type: WidthType.DXA },
            shading: { fill: 'D9E2F3', type: ShadingType.CLEAR },
            margins: cellMargins,
            verticalAlign: 'center',
            children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                    text,
                    font: { eastAsia: CONFIG.fonts.body },
                    size: CONFIG.sizes.caption,
                    bold: true
                })]
            })]
        });
    }

    function dataCell(text, width) {
        return new TableCell({
            borders,
            width: { size: width, type: WidthType.DXA },
            margins: cellMargins,
            verticalAlign: 'center',
            children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                    text,
                    font: { eastAsia: CONFIG.fonts.body },
                    size: CONFIG.sizes.caption
                })]
            })]
        });
    }

    const headerRow = new TableRow({
        children: headers.map((h, i) => headerCell(h, columnWidths[i]))
    });

    const dataRows = rows.map(row =>
        new TableRow({
            children: row.map((cell, i) => dataCell(cell, columnWidths[i]))
        })
    );

    return new Table({
        width: { size: totalWidth, type: WidthType.DXA },
        columnWidths: columnWidths,
        rows: [headerRow, ...dataRows]
    });
}

// ============================================================
// COVER PAGE
// ============================================================

function createCoverPage() {
    const children = [];

    // Logo (if provided)
    if (CONFIG.template.logoPath && fs.existsSync(CONFIG.template.logoPath)) {
        const logoData = fs.readFileSync(CONFIG.template.logoPath);
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 156 },
                children: []
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 156 },
                children: [
                    new ImageRun({
                        type: 'png',
                        data: logoData,
                        transformation: { width: 400, height: 50 },
                        altText: { title: '校徽', description: '学校校徽', name: 'logo' }
                    })
                ]
            })
        );
    }

    // Spacing
    for (let i = 0; i < 3; i++) {
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 156 },
            children: []
        }));
    }

    // Title
    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 156 },
            children: [
                new TextRun({
                    text: '实 验 报 告',
                    font: { ascii: CONFIG.fonts.title, eastAsia: CONFIG.fonts.title, hAnsi: CONFIG.fonts.title },
                    size: CONFIG.sizes.coverTitle,
                    bold: true
                })
            ]
        })
    );

    // Spacing
    for (let i = 0; i < 3; i++) {
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 156 },
            children: []
        }));
    }

    // Course name
    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 156 },
            children: [
                new TextRun({
                    text: '（实验）课程名称：',
                    font: { ascii: CONFIG.fonts.title, eastAsia: CONFIG.fonts.title, hAnsi: CONFIG.fonts.title },
                    size: 36,
                    bold: true,
                    underline: { type: 'single' }
                }),
                new TextRun({
                    text: CONFIG.template.courseName,
                    font: { ascii: CONFIG.fonts.title, eastAsia: CONFIG.fonts.title, hAnsi: CONFIG.fonts.title },
                    size: 36,
                    bold: true,
                    underline: { type: 'single' }
                })
            ]
        })
    );

    // Student name
    children.push(
        new Paragraph({
            spacing: { after: 156 },
            indent: { firstLineChars: 400, firstLine: 1124 },
            children: [
                new TextRun({
                    text: '学生姓名：',
                    font: { eastAsia: CONFIG.fonts.title },
                    size: 28,
                    bold: true
                }),
                new TextRun({
                    text: CONFIG.template.studentName || '                    ',
                    size: 28,
                    bold: true,
                    underline: { type: 'single' }
                })
            ]
        })
    );

    // Student ID
    children.push(
        new Paragraph({
            spacing: { after: 156 },
            indent: { firstLineChars: 400, firstLine: 1124 },
            children: [
                new TextRun({
                    text: '学 号：',
                    font: { eastAsia: CONFIG.fonts.title },
                    size: 28,
                    bold: true
                }),
                new TextRun({
                    text: CONFIG.template.studentId || '                         ',
                    size: 28,
                    bold: true,
                    underline: { type: 'single' }
                })
            ]
        })
    );

    // Page break
    children.push(new Paragraph({ children: [new PageBreak()] }));

    return children;
}

// ============================================================
// CONTENT SECTIONS - Customize these for your experiment
// ============================================================

function createContentSections() {
    // Replace this with your actual experiment content
    return [
        // Section 1: Experiment Title
        sectionTitle('一、实验项目名称'),
        bodyParagraph(CONFIG.template.experimentName),

        // Section 2: Theory
        sectionTitle('二、实验原理'),
        bodyParagraph('【在此填写实验原理】'),

        // Add image placeholders
        ...imagePlaceholder('原理示意图', 1),

        // Section 3: Steps
        sectionTitle('三、实验步骤'),
        bodyParagraph('【在此填写实验步骤】'),

        // Section 4: Results
        sectionTitle('四、实验结果'),
        bodyParagraph('【在此填写实验结果】'),

        // Section 5: Reflection
        sectionTitle('五、总结体会'),
        bodyParagraph('【在此填写总结体会】'),
    ];
}

// ============================================================
// DOCUMENT GENERATION
// ============================================================

async function generateReport() {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: CONFIG.fonts.body,
                        size: CONFIG.sizes.body
                    }
                }
            }
        },
        sections: [
            // Cover page
            {
                properties: {
                    page: {
                        size: { width: CONFIG.page.width, height: CONFIG.page.height },
                        margin: CONFIG.page.margin
                    }
                },
                children: createCoverPage()
            },
            // Content pages
            {
                properties: {
                    page: {
                        size: { width: CONFIG.page.width, height: CONFIG.page.height },
                        margin: CONFIG.page.margin
                    }
                },
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: '实验报告',
                                        font: { eastAsia: CONFIG.fonts.body },
                                        size: CONFIG.sizes.header,
                                        color: '808080'
                                    })
                                ]
                            })
                        ]
                    })
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: '第 ',
                                        font: { eastAsia: CONFIG.fonts.body },
                                        size: CONFIG.sizes.header
                                    }),
                                    new TextRun({
                                        children: [PageNumber.CURRENT],
                                        font: { eastAsia: CONFIG.fonts.body },
                                        size: CONFIG.sizes.header
                                    }),
                                    new TextRun({
                                        text: ' 页',
                                        font: { eastAsia: CONFIG.fonts.body },
                                        size: CONFIG.sizes.header
                                    })
                                ]
                            })
                        ]
                    })
                },
                children: createContentSections()
            }
        ]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(CONFIG.outputPath, buffer);
    console.log(`报告已生成: ${CONFIG.outputPath}`);
}

// Run
generateReport().catch(err => {
    console.error('生成失败:', err);
    process.exit(1);
});
