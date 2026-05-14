# Report Section Templates

Common section templates for different types of lab experiments.

## Computer Organization (计组实验)

### Register File (寄存器堆)

#### Theory Section
```
寄存器堆是CPU内部的重要组成部分，用于存储指令执行过程中需要的临时数据。本实验要求设计一个具有{N}个{M}位寄存器的寄存器堆。

寄存器堆的内部构成包括：
（1）{N}个{M}位的寄存器，用于存储数据；
（2）数据输入输出接口信号：busA、busB为两组{M}位的数据输出，busW为一组{M}位的数据输入；
（3）读写控制逻辑：如果写使能信号WriteEnable=1，允许写入寄存器；如果WriteEnable=0，允许读寄存器。

寄存器堆的端口说明如下：
• Rw（{K}位）：选中对应编号的寄存器，在时钟信号（clk）的上升沿，如果WriteEnable=1，则将busW的内容写入选中的寄存器；
• Ra（{K}位）：选中对应编号的寄存器，将其内容放至busA；
• Rb（{K}位）：选中对应编号的寄存器，将其内容放至busB。
```

#### Steps Section
```
（1）打开{circuit_file}文件，找到{subcircuit_name}子电路；
（2）根据寄存器堆的设计要求，使用{N}个{M}位寄存器构建寄存器堆；
（3）实现读写控制逻辑：使用Decoder对{K}位地址进行解码，选择对应的寄存器；
（4）实现写使能控制：当WriteEnable=1时，在时钟上升沿将busW的数据写入指定寄存器；
（5）实现读操作：通过Ra和Rb地址选择对应寄存器，将数据输出到busA和busB；
（6）注意：$0寄存器的值应始终为0，需要特殊处理；
（7）完成设计后，在{test_name}测试中进行自测验证。
```

### Controller (控制器)

#### Theory Section
```
控制器是CPU的核心部件之一，负责指令的译码和控制信号的生成。本实验要求设计一个能够支持{N}条MIPS指令的单周期硬布线控制器。

控制器的工作原理：通过MIPS指令分解，由OP（操作码）和Func（功能码）字段确定某种运算，给出相应的控制信号，协同数据通路工作。基于与门、或门和非门实现可编程逻辑阵列（PLA），输出相应的控制信号。

MIPS指令格式分为三种类型：
（1）R-type指令：包含rs、rt、rd、shamt和funct字段，用于寄存器间的算术逻辑运算；
（2）Load/Store指令：包含rs、rt和address字段，用于内存的读写操作；
（3）Branch指令：包含rs、rt和address字段，用于条件分支跳转。
```

### ALU (算术逻辑单元)

#### Theory Section
```
算术逻辑单元（ALU）是CPU的核心运算部件，负责执行算术运算和逻辑运算。本实验要求设计一个支持{operations}运算的ALU。

ALU的输入包括：
（1）两个{M}位的操作数A和B；
（2）{K}位的ALU控制信号，用于选择运算类型。

ALU的输出包括：
（1）{M}位的运算结果Result；
（2）Zero标志位，当结果为0时置1；
（3）Overflow溢出标志位（可选）。
```

## Digital Logic (数电实验)

### Combinational Logic (组合逻辑)

#### Theory Section
```
组合逻辑电路是指任意时刻的输出仅取决于该时刻输入信号的电路，不具有记忆功能。本实验要求设计一个{circuit_description}。

设计步骤包括：
（1）分析功能需求，列出真值表；
（2）根据真值表写出逻辑表达式；
（3）化简逻辑表达式；
（4）画出逻辑电路图；
（5）使用Logisim进行仿真验证。
```

### Sequential Logic (时序逻辑)

#### Theory Section
```
时序逻辑电路是指任意时刻的输出不仅取决于该时刻的输入信号，还取决于电路原来的状态。本实验要求设计一个{circuit_description}。

时序逻辑电路的基本组成包括：
（1）存储元件：触发器（Flip-Flop）；
（2）组合逻辑电路：用于产生输出和次态信号；
（3）时钟信号：用于同步电路状态的更新。
```

## Physics (物理实验)

### General Template

#### Theory Section
```
一、实验目的
1. {purpose_1}
2. {purpose_2}

二、实验原理
{principle_description}

主要公式：
{formula_1}
{formula_2}
```

#### Steps Section
```
三、实验步骤
1. {step_1}
2. {step_2}
3. {step_3}
```

#### Results Section
```
四、实验数据记录
{data_table}

五、数据处理
{calculation_process}

六、实验结果
{final_result} ± {uncertainty}
```

## Common Phrases

### Opening Phrases (开头语)

- 通过本次实验，我对...有了更深入的理解和实践体验。
- 本实验旨在...，通过...方法，验证...原理。
- 实验结果表明...，与理论分析相符/存在差异。

### Transition Phrases (过渡语)

- 在此基础上，进一步...
- 基于上述分析...
- 由此可知...
- 综合以上数据...

### Conclusion Phrases (总结语)

- 本次实验达到了预期目的，验证了...理论。
- 通过实验，加深了对...的理解。
- 实验结果与理论值基本一致，误差在允许范围内。
- 本次实验让我认识到理论与实践的差距...

### Error Analysis Phrases (误差分析)

- 实验误差主要来源于...
- 系统误差包括...
- 随机误差的影响因素有...
- 为了减小误差，可以采取...

## Table Templates

### Data Recording Table

```markdown
| 次数 | 测量值1 | 测量值2 | 测量值3 | 平均值 |
|------|---------|---------|---------|--------|
| 1    |         |         |         |        |
| 2    |         |         |         |        |
| 3    |         |         |         |        |
```

### Truth Table Template

```markdown
| 输入A | 输入B | 输出Y | 说明 |
|-------|-------|-------|------|
| 0     | 0     |       |      |
| 0     | 1     |       |      |
| 1     | 0     |       |      |
| 1     | 1     |       |      |
```

### Control Signal Table

```markdown
| 指令 | ALUOp | RegDst | ALUSrc | MemtoReg | RegWrite | MemRead | MemWrite | Branch |
|------|-------|--------|--------|----------|----------|---------|----------|--------|
| R-type | 10 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| lw   | 00 | 0 | 1 | 1 | 1 | 1 | 0 | 0 |
| sw   | 00 | X | 1 | X | 0 | 0 | 1 | 0 |
| beq  | 01 | X | 0 | X | 0 | 0 | 0 | 1 |
```
