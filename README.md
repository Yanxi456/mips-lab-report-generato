# Lab Report Generator (实验报告生成器)

> 一个基于 Claude Code 的自动化实验报告生成工具，支持从 PPT、DOCX、电路文件等多种源文件中提取内容，生成格式规范的 Word 实验报告。

[English](#english) | [中文](#中文)

---

## 中文

### 功能特性

- 🎯 **智能内容提取** - 自动从 PPT 讲义、实验文档、电路文件中提取关键内容
- 📝 **标准格式输出** - 符合中山大学网络空间安全学院实验报告排版规范
- 🔌 **电路文件解析** - 支持 Logisim `.circ` 文件的结构分析
- 📊 **表格自动生成** - 从 PPT 中提取真值表、控制信号表等
- 🖼️ **图片占位标记** - 自动生成图片插入位置提示，方便手动补充

### 支持的文件类型

| 文件类型 | 用途 | 提取方式 |
|----------|------|----------|
| `.docx` (模板) | 报告结构和格式 | XML 解析 |
| `.docx` (实验文档) | 实验要求和说明 | python-docx |
| `.pptx` (讲义) | 理论知识、图表 | python-pptx |
| `.circ` (Logisim) | 电路设计细节 | XML 解析 |
| `.pdf` (参考文档) | 补充资料 | pypdf |

### 快速开始

#### 前置要求

```bash
# Node.js (用于生成 DOCX)
npm install -g docx

# Python 依赖 (用于内容提取)
pip install python-pptx python-docx pypdf
```

#### 使用方法

1. 将实验相关文件放入同一目录：
   ```
   your-experiment/
   ├── 计组实验模板.docx      # 实验报告模板
   ├── 实验文档.docx          # 实验要求文档
   ├── 实验三 xxx.pptx        # 讲义 PPT
   └── 电路和依赖包/
       └── xxx.circ           # Logisim 电路文件
   ```

2. 在 Claude Code 中使用：
   ```
   使用 lab-report-generator 技能，根据文件夹中的实验文档和讲义ppt，完成以计组实验模板为模板的实验报告
   ```

3. 生成的报告将包含：
   - 完整的封面页（校徽、课程名称、学生信息）
   - 实验原理（从 PPT 提取）
   - 实验步骤（结合电路文件分析）
   - 实验结果（测试验证）
   - 总结体会
   - 红色标注的图片占位符（需手动补充）

### 报告格式规范

| 元素 | 规格 |
|------|------|
| 正文字体 | 宋体 小四 (12pt) |
| 标题字体 | 宋体 小三 (14pt) 加粗 |
| 封面标题 | 楷体 36pt 加粗 |
| 行距 | 1.5 倍 |
| 首行缩进 | 2 字符 |
| 纸张大小 | A4 |
| 页边距 | 上下 2.54cm，左右 3.17cm |

### 项目结构

```
lab-report-generator/
├── SKILL.md                          # 主技能定义文件
├── README.md                         # 项目说明文档
├── scripts/
│   ├── extract_ppt.py               # PPT 内容提取脚本
│   ├── extract_docx.py              # DOCX 内容提取脚本
│   ├── extract_circuit.py           # Logisim 电路文件解析脚本
│   └── generate_report_template.js  # DOCX 报告生成模板
└── references/
    ├── formatting_guide.md          # 排版规范指南
    └── report_templates.md          # 常用实验报告模板
```

### 支持的实验类型

#### 计算机组成原理 (计组)
- 寄存器堆 (Register File)
- 控制器 (Controller)
- ALU 算术逻辑单元
- 单周期/多周期处理器

#### 数字逻辑 (数电)
- 组合逻辑电路
- 时序逻辑电路
- 状态机设计

#### 通用实验
- 物理实验
- 其他需要标准格式报告的实验

### 自定义配置

在 `generate_report_template.js` 中修改 `CONFIG` 对象：

```javascript
const CONFIG = {
    outputPath: './实验报告.docx',
    template: {
        logoPath: null,           // 校徽图片路径
        courseName: '计组实验',    // 课程名称
        experimentName: '实验名称', // 实验名称
        studentName: '',          // 学生姓名
        studentId: '',            // 学号
    },
    // ... 更多配置
};
```

---

## English

### Features

- 🎯 **Smart Content Extraction** - Automatically extract key content from PPT lectures, experiment documents, and circuit files
- 📝 **Standard Format Output** - Comply with Chinese university lab report formatting standards
- 🔌 **Circuit File Parsing** - Support Logisim `.circ` file structure analysis
- 📊 **Auto Table Generation** - Extract truth tables, control signal tables from PPT
- 🖼️ **Image Placeholders** - Auto-generate image insertion position markers

### Quick Start

#### Prerequisites

```bash
# Node.js (for DOCX generation)
npm install -g docx

# Python dependencies (for content extraction)
pip install python-pptx python-docx pypdf
```

#### Usage

1. Place experiment files in the same directory
2. Use in Claude Code:
   ```
   Use lab-report-generator skill to create a lab report based on the template, experiment document, and lecture PPT
   ```

### Supported Experiment Types

- Computer Organization (寄存器堆, 控制器, ALU, Processor)
- Digital Logic (Combinational, Sequential, State Machines)
- General Physics Experiments

---

## Contributing

欢迎提交 Issue 和 Pull Request！

## License

MIT License

## Author

- GitHub: [@Yanxi456](https://github.com/Yanxi456)

## Acknowledgments

- [Claude Code](https://docs.anthropic.com/claude-code) - AI 编程助手
- [docx-js](https://docx.js.org/) - Word 文档生成库
- [python-pptx](https://python-pptx.readthedocs.io/) - PPT 解析库
- [Logisim](http://www.cburch.com/logisim/) - 电路仿真工具
