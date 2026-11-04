# 第三方资源声明

本项目**源代码**可自由使用。但内置的词库数据、词频数据来自第三方，需遵守各自的许可证。
**其中有一项明确限制商用，请务必读完第 3 节。**

---

## 1. 词库数据（单词、词性、释义、词组）

**来源**：https://github.com/KyleBing/english-vocabulary

`data/cet4.js`（四级 4544 词）与 `data/cet6.js`（六级 2118 词）由该项目
`json/3-CET4-顺序.json` 和 `json/4-CET6-顺序.json` 转换而来，
转换脚本见构建目录 `build.js`。字段被压缩为 `[单词, 词性, 释义, 词组]`，
词语内容本身未作修改（仅去重、重新排序）。

**许可证**：BSD 3-Clause License

```
BSD 3-Clause License

Copyright (c) 2022-2026, KyleBing
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

---

## 2. 六级真题词频数据（用于决定单词学习顺序）

**来源**：https://github.com/wangjiuyi543-ui/cet6-vocabulary

该项目的 `cet6_high_frequency_words.csv` 统计了 2020–2025 年六级真题中
各词的出现频次与重要度评分。本项目用其中的 `importance_score` 字段
**对单词进行排序**，未直接打包该 CSV 文件本身。

**许可证**：MIT License

```
MIT License

Copyright (c) 2026 wangjiuyi543-ui

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

> 该仓库的真题频次由项目作者自行统计。如果你要把它用于正式出版物或商业产品，
> 建议自行核对数据来源的合法性。

---

## 3. ⚠️ 通用词频数据（用于给未命中真题表的词排序）

**来源**：https://github.com/first20hours/google-10000-english

该词表由 **Google Web Trillion Word Corpus** 派生（Brants & Franz，
经 Linguistic Data Consortium 分发，Peter Norvig 提取子集）。

**许可证：仅限教育用途与个人/研究用途，不可商用。**

原仓库许可证原文：

> Data files are derived from the *Google Web Trillion Word Corpus*, as described
> by Thorsten Brants and Alex Franz, and distributed by the Linguistic Data
> Consortium. Subsets of this corpus distributed by Peter Norvig. Corpus editing
> and cleanup by Josh Kaufman.
>
> Educational and personal/research use of this data is permitted under the LDC
> license, Norvig's MIT license for his contributions, and US fair use doctrine.
> **I do not recommend using this data for commercial purposes without licensing
> it from the Linguistic Data Consortium.**

### 这意味着什么

| 用途 | 是否允许 |
| --- | --- |
| 自己学习使用 | ✅ 允许 |
| 放在 GitHub 上开源、供他人免费学习 | ✅ 允许（教育用途） |
| 个人研究、课程作业 | ✅ 允许 |
| **做成付费产品、商业 App、广告变现** | ❌ **不允许**，需先向 LDC 购买语料许可 |

如果你打算把这个项目商业化，需要替换掉第 3 节的词频数据
（改用自己统计的语料，或购买 LDC 许可），第 1、2 节的数据不受此限制。

---

## 4. 高中词表（用于识别"已知基础词"，把它们排到学习顺序最后）

**来源**：同上 https://github.com/KyleBing/english-vocabulary 的 `2 高中-乱序.txt`

仅用于判断某个 CET4 词是否属于高中阶段已学内容，**该词表本身未被打包进网站**。
许可证同第 1 节（BSD 3-Clause）。

---

## 5. 单词例句（data/examples.js，4382 条例句）

例句有两个来源，合计覆盖词库中 66% 的单词（**学习顺序最靠前的核心词 100% 覆盖**）。

### 5a. Tatoeba 中英对照句库（3466 条）

**来源**：https://tatoeba.org/ ，中英对照版本经 https://www.manythings.org/anki/ 整理分发

**许可证**：CC-BY 2.0（署名即可商用）

```
The English and Chinese sentences are from Tatoeba (https://tatoeba.org/),
licensed under CC-BY 2.0. Contributors are credited on the Tatoeba website.
```

处理方式：只从长度 4–14 词的句子中，为每个 CET 词挑选最合适的一句；
使用 OpenCC 把繁体译文统一转为简体（见 5c）。

### 5b. 本项目手写例句（916 条）

学习顺序最靠前的 916 个核心学术词（如 significant、facilitate、priority、
sustainable），在 Tatoeba 口语语料中恰好缺失，因此由本项目逐条编写，
语域刻意贴近四六级真题（校园、社会、科技、环境、职场）。
**这部分版权归本项目所有**，可自由使用。

### 5c. OpenCC 繁简映射表（构建期使用）

**来源**：https://github.com/BYVoid/OpenCC 的 `data/dictionary/TSCharacters.txt`

**许可证**：Apache-2.0

仅用于在**构建阶段**把 Tatoeba 的繁体译文转为简体。
该映射表本身**未被打包进网站**，只有转换后的简体文本随例句一同发布。

---

## 6. 考试常用短语（data/exam-phrases.js，634 条）

**候选来源**：https://github.com/2ndLA/english-phrases 的 `lists/cet4.txt` 与 `lists/cet6.txt`

**许可证**：**CC BY-SA 4.0**（署名 + 相同方式共享）

### 这意味着什么

该许可要求：**衍生数据必须用同样的 CC BY-SA 4.0 许可发布**。

| 用途 | 是否允许 |
| --- | --- |
| 自己学习、开源供他人免费学习 | ✅ 允许 |
| 修改后继续以 CC BY-SA 4.0 发布 | ✅ 允许 |
| **把短语数据改成闭源、专有许可** | ❌ **不允许** |

**`data/exam-phrases.js` 因此按 CC BY-SA 4.0 发布**，
其余文件（代码、手写内容）不受此限制。

### 处理方式（并非原样照搬）

原始候选表共 4174 条，其中包含大量机械组合（`box in`、`key in`、`pack in`、`book in`）
和生僻习语。本项目做了大量筛选与重写：

- **剔除**：无独立引申义的「动词 + 介词」机械穷举、生僻俚语
- **保留并重写释义**：634 条真正有考试价值的短语，中文释义全部由本项目编写
- **补充**：源表遗漏的高频短语（`turn out`、`break down`、`work out`、`look forward to` 等）
- **分类**：按介词短语 / 动词短语 / be + 形容词 + 介词 / 名词短语 / 习语 五类重新组织

因此数据集在选材和释义上均已有实质改动，但依据 ShareAlike 条款，
仍按 CC BY-SA 4.0 发布。

---

## 7. 音标数据（data/phonetics.js，6645 词）

**来源**：https://github.com/open-dict-data/ipa-dict 的 `data/en_US.txt`

**许可证**：MIT License

```
The MIT License (MIT)

Copyright (c) 2016 dohliam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

处理方式：一词多音时只保留第一个（最常见读音）；英式拼写在构建阶段
通过别名表（gaol→jail、vapour→vapor 等）映射到美式拼写查询。
最终覆盖词库中 **6645 / 6662 词（99.7%）**。

---

## 8. 语法专项（data/grammar.js）

六个专题（定语从句、非谓语动词、虚拟语气、倒装句、名词性从句、主谓一致）的
规则说明、例句、常见错误对照、考点提示，**全部由本项目自行编写**，
不涉及第三方版权。

---

## 9. 作文范文、模板、翻译表达

`data/writing.js` 与 `data/phrases.js` 中的题型模板、万能句型、高级替换词、
完整范文、译文、翻译技巧等内容，均由本项目自行编写，不涉及第三方版权。

这些是应试写作的通用句式，不同教辅中都有类似表述。
**建议按自己的表达习惯改写后再背诵**，避免考场作文与他人雷同。

---

## 10. 语音发音

发音由浏览器原生 `SpeechSynthesis` API 提供，调用操作系统已安装的语音包。
本项目不打包任何音频文件，也不向任何服务器发送请求。
听力听写练习同样复用这个能力，用已有例句做素材，不额外引入音频版权。

---

## 许可证汇总

| 文件 | 来源 | 许可证 | 能否商用 |
| --- | --- | --- | --- |
| `data/cet4.js`、`data/cet6.js` | KyleBing/english-vocabulary | BSD 3-Clause | ✅ |
| `data/examples.js` 中的 3466 条 | Tatoeba | CC-BY 2.0 | ✅（需署名） |
| `data/examples.js` 中的 916 条 | 本项目 | 自有 | ✅ |
| `data/phonetics.js` | open-dict-data/ipa-dict | MIT | ✅ |
| `data/exam-phrases.js` | 2ndLA/english-phrases + 本项目整理 | **CC BY-SA 4.0** | ✅（须同样开源） |
| `data/grammar.js` | 本项目 | 自有 | ✅ |
| `data/writing.js`、`data/phrases.js` | 本项目 | 自有 | ✅ |
| 排序用词频数据 | Google 语料 | LDC，教育/个人用途 | ❌ **不可商用** |
| 真题词频数据 | wangjiuyi543-ui/cet6-vocabulary | MIT | ✅ |
| 其余代码 | 本项目 | 自有 | ✅ |
