/* 语法专项 —— 四六级阅读、翻译、写作共同的底层考点
   每篇结构：核心规则 → 正例 → 常见错误（错 vs 对）→ 考点提示
   例句语域贴近考试，不写口语对话。 */
window.CET_GRAMMAR = {
  topics: [
    /* ═══════════════ 1. 定语从句 ═══════════════ */
    {
      id: 'attributive',
      name: '定语从句',
      en: 'Attributive Clauses',
      intro: '阅读里最长、翻译里最难的一句往往就是它。核心只有一件事：先找到先行词，再判断它在从句里当什么成分。',
      points: [
        {
          title: '关系代词怎么选：看它在从句里做什么',
          rule: '先行词是人用 who/whom/whose；是物用 which/that；关系代词在从句中作宾语时可以省略。',
          examples: [
            { en: 'The scientist who discovered the drug won the prize.', zh: '发现这种药物的科学家获奖了。', why: 'who 在从句中作主语，指人。' },
            { en: 'This is the book (which/that) I mentioned yesterday.', zh: '这就是我昨天提到的那本书。', why: 'which/that 作 mentioned 的宾语，可省略。' },
            { en: 'The student whose essay won the prize is from our class.', zh: '论文获奖的那位学生是我们班的。', why: 'whose 表所属，后面必须紧跟名词。' }
          ],
          errors: [
            { wrong: 'The man which lives next door is a doctor.', right: 'The man who lives next door is a doctor.', why: '先行词是人，不能用 which。' },
            { wrong: 'This is the house where I lived in.', right: 'This is the house where I lived. / This is the house (that) I lived in.', why: 'where 已替代介词短语，句末不能再加 in。' }
          ]
        },
        {
          title: '限制性 vs 非限制性：逗号决定一切',
          rule: '加逗号的是非限制性从句，只是补充说明；不能用 that，也不能省略关系词。',
          examples: [
            { en: 'The students who passed the exam were praised.', zh: '通过考试的那些学生受到了表扬。', why: '限制性：只有通过的那部分学生。' },
            { en: 'The students, who passed the exam, were praised.', zh: '这些学生都通过了考试，受到了表扬。', why: '非限制性：所有学生都通过了。意思完全不同。' }
          ],
          errors: [
            { wrong: 'My father, that works in a hospital, is a doctor.', right: 'My father, who works in a hospital, is a doctor.', why: '非限制性从句绝不能用 that。' }
          ]
        },
        {
          title: '介词 + 关系代词（翻译高频）',
          rule: '介词提前时只能用 whom（人）或 which（物），不能用 that 或 who。',
          examples: [
            { en: 'The rate at which the population grows has slowed down.', zh: '人口增长的速度已经放缓。', why: 'at the rate 是固定搭配，介词 at 提前。' },
            { en: 'The professor to whom I spoke was very patient.', zh: '和我交谈的那位教授非常耐心。', why: 'speak to sb，介词 to 提前，用 whom。' }
          ],
          errors: [
            { wrong: 'The house in that he lives is old.', right: 'The house in which he lives is old.', why: '介词后不能用 that。' }
          ]
        }
      ],
      examTips: [
        '阅读长难句先划出先行词，再把从句整个括起来，主干就露出来了。',
        '翻译时中文的「……的」结构如果太长，用 which/that 从句比硬塞形容词更自然。',
        '写作里非限制性从句是加分项，但逗号写错会变成语法错误，不确定就用限制性。'
      ]
    },

    /* ═══════════════ 2. 非谓语动词 ═══════════════ */
    {
      id: 'nonfinite',
      name: '非谓语动词',
      en: 'Non-finite Verbs',
      intro: '一句话只能有一个谓语动词，其余的必须变成 to do / doing / done。这是翻译和写作扣分最集中的地方。',
      points: [
        {
          title: 'to do / doing / done 的本质区别',
          rule: 'to do 表目的或将来；doing 表主动、进行；done 表被动、完成。',
          examples: [
            { en: 'To reduce pollution, the city banned private cars downtown.', zh: '为了减少污染，该市禁止私家车进入市中心。', why: 'to do 表目的。' },
            { en: 'Walking along the river, she thought about her future.', zh: '沿着河边走时，她想着自己的未来。', why: 'doing：主语 she 主动走，且同时进行。' },
            { en: 'Built in 1950, the building now serves as a museum.', zh: '这座建筑建于 1950 年，现在用作博物馆。', why: 'done：建筑是被建造的，表被动。' }
          ],
          errors: [
            { wrong: 'Built in 1950, the government uses it as a museum.', right: 'Built in 1950, the building is now used as a museum.', why: '非谓语的逻辑主语必须和主句主语一致，否则叫「悬垂结构」。' }
          ]
        },
        {
          title: '哪些动词后接 doing，哪些接 to do',
          rule: '记住高频的：enjoy / avoid / consider / suggest / mind / risk / involve + doing；decide / refuse / manage / afford / tend / fail + to do。',
          examples: [
            { en: 'We should avoid making the same mistake twice.', zh: '我们应当避免两次犯同样的错误。', why: 'avoid + doing。' },
            { en: 'She managed to finish the report before midnight.', zh: '她设法在午夜前完成了报告。', why: 'manage + to do。' },
            { en: 'The new policy involves raising taxes on tobacco.', zh: '新政策包括提高烟草税。', why: 'involve + doing，翻译高频。' }
          ],
          errors: [
            { wrong: 'She suggested to postpone the meeting.', right: 'She suggested postponing the meeting.', why: 'suggest 后接 doing 或 that 从句，不接 to do。' }
          ]
        },
        {
          title: '独立主格（写作加分项）',
          rule: '非谓语自带主语时，用「名词 + 非谓语」结构，前后用逗号隔开。',
          examples: [
            { en: 'Weather permitting, the sports meeting will be held tomorrow.', zh: '天气允许的话，运动会明天举行。', why: 'weather 是 permitting 自己的主语。' },
            { en: 'With the problem solved, the team moved on to the next task.', zh: '问题解决后，团队转向下一项任务。', why: 'with + 名词 + done 是固定结构。' }
          ],
          errors: [
            { wrong: 'Being a hot day, we stayed indoors.', right: 'It being a hot day, we stayed indoors.', why: '天气热的主语是 it，不是 we。' }
          ]
        }
      ],
      examTips: [
        '翻译时先数动词：中文一句话串了三个动词，英文只能留一个当谓语，其余全要变形。',
        '写作想写长句又怕错，就用 done/doing 开头，比从句更简洁也更安全。',
        '看到「被……的」先想 done，看到「正在……的」先想 doing。'
      ]
    },

    /* ═══════════════ 3. 虚拟语气 ═══════════════ */
    {
      id: 'subjunctive',
      name: '虚拟语气',
      en: 'Subjunctive Mood',
      intro: '四六级真题反复考。判断标准只有一条：说的是事实还是假设。是假设，就要按「时间往前推一步」变形。',
      points: [
        {
          title: 'if 条件句：现在 / 过去 / 将来',
          rule: '与现在事实相反：if + 过去式，主句 would do。与过去相反：if + had done，主句 would have done。与将来相反：if + were to do / should do，主句 would do。',
          examples: [
            { en: 'If I were you, I would apply for the scholarship.', zh: '如果我是你，我会申请奖学金。', why: '与现在相反，be 动词一律用 were。' },
            { en: 'If they had acted earlier, the accident could have been avoided.', zh: '如果他们早点行动，这场事故本可避免。', why: '与过去相反：had done + would have done。' },
            { en: 'If the plan were to fail, we would have no alternative.', zh: '如果计划失败，我们将别无选择。', why: '与将来相反：were to do。' }
          ],
          errors: [
            { wrong: 'If I would have known, I would have told you.', right: 'If I had known, I would have told you.', why: 'if 从句里不能用 would have，只能用 had done。' }
          ]
        },
        {
          title: 'should 型虚拟（that 从句）',
          rule: '表示「建议、要求、命令、坚持」的动词和形容词后，that 从句用 (should) + 动词原形，should 可省略。',
          examples: [
            { en: 'The committee recommended that the rule (should) be revised.', zh: '委员会建议修订该规则。', why: 'recommend 后接 (should) do，注意用 be 原形。' },
            { en: 'It is essential that every student (should) attend the lecture.', zh: '每个学生都必须参加这场讲座。', why: 'essential / necessary / vital 后同样用 (should) do。' }
          ],
          errors: [
            { wrong: 'It is important that he goes to see a doctor.', right: 'It is important that he (should) go to see a doctor.', why: '这类形容词后的从句要用动词原形，不加 -s。' }
          ]
        },
        {
          title: 'if 省略后的倒装',
          rule: 'if 从句里有 were / had / should 时，可省略 if 并把这三个词提到句首。',
          examples: [
            { en: 'Were it not for your help, I would have failed.', zh: '要不是你的帮助，我早就失败了。', why: '= If it were not for your help。' },
            { en: 'Had I known the truth, I would have acted differently.', zh: '要是我知道真相，我会另作选择。', why: '= If I had known the truth。' },
            { en: 'Should anyone call, please take a message.', zh: '万一有人打电话，请留言。', why: '= If anyone should call。' }
          ],
          errors: [
            { wrong: 'Was I you, I would accept the offer.', right: 'Were I you, I would accept the offer.', why: '倒装时 be 动词只能用 were。' }
          ]
        },
        {
          title: 'wish / as if / would rather',
          rule: 'wish 后表示与现在相反用过去式，与过去相反用 had done。as if 同理。',
          examples: [
            { en: 'I wish I had taken your advice earlier.', zh: '我真希望早点听了你的建议。', why: '对过去的遗憾：had done。' },
            { en: 'He talks as if he knew everything about it.', zh: '他谈起这事好像什么都懂。', why: '与现在事实相反：过去式。' }
          ],
          errors: [
            { wrong: 'I wish I have more time.', right: 'I wish I had more time.', why: 'wish 后不能直接用现在时。' }
          ]
        }
      ],
      examTips: [
        '先问自己：这句话说的事发生了吗？没发生才用虚拟。',
        '写作里用一句 If I were..., I would... 是稳妥的加分句。',
        '注意「本来应该做而没做」：should have done，这也是虚拟的一种。'
      ]
    },

    /* ═══════════════ 4. 倒装句 ═══════════════ */
    {
      id: 'inversion',
      name: '倒装句',
      en: 'Inversion',
      intro: '作文结尾最容易提分的一招，也是阅读里的干扰点。分两种：全部倒装（谓语整个提前）和部分倒装（只提前助动词）。',
      points: [
        {
          title: '否定词置句首 → 部分倒装',
          rule: 'never / seldom / hardly / rarely / little / not only / no sooner / under no circumstances 放句首时，主句倒装。',
          examples: [
            { en: 'Never before have we faced such a serious challenge.', zh: '我们从未面临如此严峻的挑战。', why: 'Never 置首，have 提前。' },
            { en: 'Not only did he finish the task, but he also helped others.', zh: '他不仅完成了任务，还帮助了别人。', why: 'Not only 置首，主句倒装；but also 后不倒装。' },
            { en: 'Under no circumstances should students cheat in exams.', zh: '学生在任何情况下都不应作弊。', why: '写作高分句，语气最强。' }
          ],
          errors: [
            { wrong: 'Not only he finished the task, but he also helped others.', right: 'Not only did he finish the task, but he also helped others.', why: 'Not only 置首必须倒装，漏了 did 是典型扣分点。' }
          ]
        },
        {
          title: 'Only + 状语置句首 → 部分倒装',
          rule: 'Only 修饰状语（副词、介词短语、状语从句）并置于句首时，主句倒装；但 only 修饰主语时不倒装。',
          examples: [
            { en: 'Only in this way can we solve the problem.', zh: '只有这样我们才能解决问题。', why: '作文万能结尾句。' },
            { en: 'Only when we understand the causes can we find solutions.', zh: '只有理解了原因，我们才能找到解决办法。', why: 'Only + 状语从句，主句倒装。' },
            { en: 'Only he knows the truth.', zh: '只有他知道真相。', why: 'only 修饰主语 he，用正常语序。' }
          ],
          errors: [
            { wrong: 'Only in this way we can solve the problem.', right: 'Only in this way can we solve the problem.', why: 'Only + 状语置首，主句必须倒装。' }
          ]
        },
        {
          title: 'so / neither / nor 表示「也」',
          rule: '肯定重复用 So + 助动词 + 主语；否定重复用 Neither/Nor + 助动词 + 主语。',
          examples: [
            { en: 'He enjoys reading, and so does she.', zh: '他喜欢读书，她也喜欢。', why: 'so + does + 主语。' },
            { en: 'I have never been abroad, and neither has my brother.', zh: '我从没出过国，我弟弟也没有。', why: 'neither + has + 主语。' }
          ],
          errors: [
            { wrong: 'I like reading, so she does.', right: 'I like reading, so does she.', why: 'so 引导的倒装，助动词必须在主语前。' }
          ]
        }
      ],
      examTips: [
        '倒装是写作的「显眼包」，一篇用一个就够，用多了反而显得刻意。',
        'Only in this way can we… 几乎是万能结尾，建议直接背下来。',
        '阅读里遇到倒装别慌：把语序还原成正常顺序再理解。'
      ]
    },

    /* ═══════════════ 5. 名词性从句 ═══════════════ */
    {
      id: 'nominal',
      name: '名词性从句',
      en: 'Noun Clauses',
      intro: '主语从句、宾语从句、表语从句、同位语从句统称名词性从句。判断方法：它在句中充当名词的角色。',
      points: [
        {
          title: 'that vs what：看从句缺不缺成分',
          rule: 'that 只起连接作用，从句成分完整；what 本身在从句中充当主语或宾语，从句成分不完整。',
          examples: [
            { en: 'What matters is not the result but the process.', zh: '重要的不是结果，而是过程。', why: 'what 在从句中作主语。' },
            { en: 'That he passed the exam surprised everyone.', zh: '他通过了考试，这让所有人惊讶。', why: '从句成分完整，用 that。' },
            { en: 'The fact that she was late is undeniable.', zh: '她迟到这一事实不可否认。', why: '同位语从句，that 不能换成 which。' }
          ],
          errors: [
            { wrong: 'That he said made no sense.', right: 'What he said made no sense.', why: 'said 缺宾语，必须用 what。' }
          ]
        },
        {
          title: 'it 作形式主语',
          rule: '主语从句太长时，用 it 占位，把真正的主语放到句末，这是写作的加分结构。',
          examples: [
            { en: 'It is widely acknowledged that education shapes a nation\'s future.', zh: '人们普遍认为教育塑造一个国家的未来。', why: 'it 作形式主语，that 从句真正的主语。' },
            { en: 'It remains unclear whether the policy will work.', zh: '这项政策是否有效仍不清楚。', why: 'whether 引导主语从句，用 it 占位。' }
          ],
          errors: [
            { wrong: 'It is said that he is clever, isn\'t it?', right: 'It is said that he is clever, isn\'t he?', why: '反义疑问句看的是真正的主语，不是形式主语 it。' }
          ]
        },
        {
          title: '同位语从句 vs 定语从句',
          rule: '同位语从句解释前面名词的「内容」，that 在从句中不作成分；定语从句修饰名词，that 在从句中作成分。',
          examples: [
            { en: 'The news that our team won excited us all.', zh: '我们队获胜的消息让我们都很兴奋。', why: '同位语：that 从句说明 news 的内容。' },
            { en: 'The news that he told me turned out to be false.', zh: '他告诉我的那个消息结果是假的。', why: '定语从句：that 作 told 的宾语。' }
          ],
          errors: [
            { wrong: 'The idea that he came up with was brilliant.', right: 'The idea (that/which) he came up with was brilliant.', why: '这里 that 是 come up with 的宾语，属定语从句，不是同位语。' }
          ]
        }
      ],
      examTips: [
        '翻译「……的事实/观点/建议」时，同位语从句 the fact that… 比 of 结构更自然。',
        '写作开头用 It is widely believed that… 比 I think… 正式得多。',
        '遇到长句先找 that：从句成分完整就是同位语/宾语从句，不完整就是定语从句。'
      ]
    },

    /* ═══════════════ 6. 主谓一致 ═══════════════ */
    {
      id: 'agreement',
      name: '主谓一致',
      en: 'Subject-Verb Agreement',
      intro: '看起来最简单，却最容易在写作和翻译里丢分，因为它考查的往往是判断主语单复数的能力，而不是语法本身。',
      points: [
        {
          title: '就近原则',
          rule: 'either…or / neither…nor / not only…but also / there be 结构，谓语动词与最近的那个主语一致。',
          examples: [
            { en: 'Neither the students nor the teacher was aware of the change.', zh: '学生和老师都没意识到这一变化。', why: '最近的主语是 teacher，用 was。' },
            { en: 'There is a book and two pens on the desk.', zh: '桌上有一本书和两支笔。', why: '就近原则，最近的是 a book。' }
          ],
          errors: [
            { wrong: 'Neither the teacher nor the students was aware of it.', right: 'Neither the teacher nor the students were aware of it.', why: '最近的主语是 students（复数），用 were。' }
          ]
        },
        {
          title: '集合名词',
          rule: 'family / team / committee / government 强调整体用单数，强调成员用复数。',
          examples: [
            { en: 'The committee has made its decision.', zh: '委员会已作出决定。', why: '作为整体，单数。' },
            { en: 'The committee are divided on this issue.', zh: '委员会成员在这个问题上意见分歧。', why: '强调成员，复数（英式英语更常见）。' }
          ],
          errors: [
            { wrong: 'The team are going to win the game.', right: 'The team is going to win the game.', why: '作为整体，通常用单数。' }
          ]
        },
        {
          title: '易混淆的复数形式',
          rule: 'news / mathematics / physics 虽以 s 结尾但为单数；people / police / cattle 是复数。',
          examples: [
            { en: 'The news is far more encouraging than expected.', zh: '这个消息比预期的更令人鼓舞。', why: 'news 是单数，用 is。' },
            { en: 'The police are looking into the case.', zh: '警方正在调查此案。', why: 'police 总是复数。' }
          ],
          errors: [
            { wrong: 'The news are good today.', right: 'The news is good today.', why: 'news 不可数，作单数。' }
          ]
        },
        {
          title: 'with / along with / as well as 不改变主语数',
          rule: '这些词引导的是伴随成分，谓语仍与前面的主语一致。',
          examples: [
            { en: 'The teacher, along with the students, was invited to the ceremony.', zh: '老师和学生们一起受邀参加了典礼。', why: '真正主语是 the teacher，用 was。' },
            { en: 'The manager as well as his assistants has agreed to the plan.', zh: '经理和他的助手们都同意了这个方案。', why: 'as well as 后的成分不影响主语数。' }
          ],
          errors: [
            { wrong: 'The teacher with his students have arrived.', right: 'The teacher with his students has arrived.', why: 'with 不改变主语数，仍是 the teacher。' }
          ]
        }
      ],
      examTips: [
        '写作写长句时，先找出真正的主语，再决定动词形式。',
        '遇到 either…or 这类结构，动词就跟着最近的那个名词走，不用纠结。',
        '翻译「有……」时，there be 的单复取决于紧跟其后的名词。'
      ]
    }
  ]
};
