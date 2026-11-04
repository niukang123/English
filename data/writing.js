/* 作文模板库 —— 四六级写作万能框架、句型、高级替换词 */
window.CET_WRITING = {
  categories: [
    {
      id: 'contrast',
      name: '议论文 · 观点对比型',
      desc: '题目给出两种对立观点，要求你讨论双方并表明自己的立场。出现频率最高。',
      stages: [
        {
          stage: '第一段 · 引出话题与双方观点',
          zh: '先点题，再摆出两种对立看法。不要在第一段就表态。',
          patterns: [
            { en: 'When it comes to ______, opinions vary from person to person.', zh: '谈到______，人们看法不一。' },
            { en: 'There is a heated debate over whether ______.', zh: '关于是否______，存在激烈的争论。' },
            { en: 'Some people hold the view that ______, while others argue that ______.', zh: '有些人认为______，而另一些人则主张______。' },
            { en: 'Attitudes towards ______ differ widely among the public.', zh: '公众对______的态度差异很大。' }
          ]
        },
        {
          stage: '第二段 · 论证双方 + 表明立场',
          zh: '用 On the one hand / On the other hand 分述两方，最后用自己立场收束。这一段是得分核心，务必写满。',
          patterns: [
            { en: 'Those who advocate ______ believe that ______.', zh: '支持______的人认为______。' },
            { en: 'On the one hand, ______. On the other hand, ______.', zh: '一方面，______。另一方面，______。' },
            { en: 'It is undeniable that ______, but it does not mean that ______.', zh: '不可否认______，但这并不意味着______。' },
            { en: 'As far as I am concerned, the advantages far outweigh the disadvantages.', zh: '就我而言，利远大于弊。' },
            { en: 'From my perspective, ______ is more reasonable for the following reasons.', zh: '在我看来，由于以下原因______更为合理。' }
          ]
        },
        {
          stage: '第三段 · 总结',
          zh: '重述立场 + 提出建议或展望。',
          patterns: [
            { en: 'Taking all these factors into consideration, we may safely draw the conclusion that ______.', zh: '综合考虑以上因素，我们可以稳妥地得出结论：______。' },
            { en: 'Therefore, it is high time that we attached greater importance to ______.', zh: '因此，我们该更加重视______了。' },
            { en: 'Only in this way can we ______.', zh: '只有这样我们才能______。' }
          ]
        }
      ]
    },
    {
      id: 'phenomenon',
      name: '议论文 · 现象解释型',
      desc: '描述一个社会现象，分析其产生原因和影响。',
      stages: [
        {
          stage: '第一段 · 描述现象',
          zh: '用数据或生活化细节开头，比空泛的 "Nowadays" 更出彩。',
          patterns: [
            { en: 'In recent years, ______ has become a common phenomenon in our daily life.', zh: '近年来，______已成为我们日常生活中的普遍现象。' },
            { en: 'Nowadays, an increasing number of people are paying attention to ______.', zh: '如今，越来越多的人开始关注______。' },
            { en: 'It is widely observed that ______.', zh: '人们普遍注意到______。' }
          ]
        },
        {
          stage: '第二段 · 分析原因',
          zh: '原因至少写两条，用 First and foremost / In addition 分层。',
          patterns: [
            { en: 'Several factors contribute to this trend, and the following ones are the most important.', zh: '有几个因素促成了这一趋势，以下最为重要。' },
            { en: 'First and foremost, ______. In addition, ______.', zh: '首先，______。此外，______。' },
            { en: 'This phenomenon can be attributed to the rapid development of ______.', zh: '这一现象可归因于______的快速发展。' }
          ]
        },
        {
          stage: '第三段 · 影响与对策',
          zh: '一分为二地看待，再给出可行建议。',
          patterns: [
            { en: 'Like a coin has two sides, ______ has both positive and negative effects.', zh: '正如硬币有两面，______既有积极影响也有消极影响。' },
            { en: 'If we take effective measures, this problem will be well solved.', zh: '如果我们采取有效措施，这个问题将得到妥善解决。' },
            { en: 'It is our responsibility to make the best use of ______ while avoiding its drawbacks.', zh: '我们的责任是充分利用______并规避其弊端。' }
          ]
        }
      ]
    },
    {
      id: 'chart',
      name: '图表作文',
      desc: '给出柱状图/折线图/饼图，要求描述数据变化并分析原因。',
      stages: [
        {
          stage: '第一段 · 描述图表',
          zh: '一句话点明图表主题，再引用 2–3 个关键数据。不要罗列所有数字。',
          patterns: [
            { en: 'As is vividly shown in the chart, ______.', zh: '如图表生动显示的，______。' },
            { en: 'The chart above clearly illustrates the changes in ______ from ______ to ______.', zh: '上图清楚展示了______从______到______的变化。' },
            { en: 'The number of ______ rose / dropped sharply, increasing / decreasing from ______ to ______.', zh: '______的数量急剧上升/下降，从______增至/降至______。' },
            { en: 'It accounts for approximately ______ percent of the total.', zh: '它约占总量的百分之______。' }
          ]
        },
        {
          stage: '第二段 · 分析原因',
          zh: '把数据变化和社会背景挂钩。',
          patterns: [
            { en: 'What has caused this change? Several reasons can be listed as follows.', zh: '是什么导致了这一变化？原因可列举如下。' },
            { en: 'The change is closely related to ______.', zh: '这一变化与______密切相关。' },
            { en: 'With the improvement of living standards, people are more willing to ______.', zh: '随着生活水平提高，人们更愿意______。' }
          ]
        },
        {
          stage: '第三段 · 预测趋势',
          zh: '合理预测 + 一句评论。',
          patterns: [
            { en: 'Based on the analysis above, we can predict that the trend will continue in the years to come.', zh: '基于以上分析，我们可以预测这一趋势在今后数年仍将持续。' },
            { en: 'It is reasonable to believe that ______ will keep growing steadily.', zh: '有理由相信______将持续稳步增长。' }
          ]
        }
      ]
    },
    {
      id: 'letter',
      name: '应用文 · 书信 / 邮件',
      desc: '建议信、投诉信、感谢信、申请信、邀请信。注意格式分。',
      stages: [
        {
          stage: '称呼与开头',
          zh: '称呼顶格，正文缩进或空行。开头务必说明写信目的。',
          patterns: [
            { en: 'Dear ______,', zh: '亲爱的______：' },
            { en: 'I am writing to express my ______ concerning ______.', zh: '我写信是为了表达我对______的______。' },
            { en: 'I am writing to apply for the position of ______ advertised on ______.', zh: '我写信是为申请在______上发布的______职位。' }
          ]
        },
        {
          stage: '正文 · 说明情况',
          zh: '分层陈述，一段一个要点。',
          patterns: [
            { en: 'I would like to make some suggestions on ______.', zh: '我想就______提出一些建议。' },
            { en: 'To begin with, ______. Furthermore, ______.', zh: '首先，______。此外，______。' },
            { en: 'I am deeply grateful for your generous help, without which I could not have ______.', zh: '我非常感激你的慷慨帮助，没有它我无法______。' },
            { en: 'I am afraid I have to make a complaint about ______.', zh: '恐怕我不得不就______提出投诉。' }
          ]
        },
        {
          stage: '结尾与落款',
          zh: '表达期待 + 礼貌结语。落款签名别写自己真名，用 Li Ming。',
          patterns: [
            { en: 'I would appreciate it if you could take my suggestions into consideration.', zh: '如果您能考虑我的建议，我将不胜感激。' },
            { en: 'I am looking forward to your early reply.', zh: '期待您的早日回复。' },
            { en: 'Thank you for your time and consideration.', zh: '感谢您的时间和考虑。' },
            { en: 'Yours sincerely,\nLi Ming', zh: '您真诚的，\n李明' }
          ]
        }
      ]
    },
    {
      id: 'proverb',
      name: '谚语警句型',
      desc: '题目给出一句英文谚语或名言，要求你阐释其含义并举例论证。',
      stages: [
        {
          stage: '第一段 · 引出谚语',
          zh: '先复述谚语，再点出它揭示的道理。',
          patterns: [
            { en: 'The proverb "______" has been widely quoted for generations.', zh: '谚语"______"世代传诵。' },
            { en: 'Simple as the saying is, its meaning is profound and far-reaching.', zh: '这句话虽然简单，含义却深刻而深远。' },
            { en: 'It conveys the message that ______.', zh: '它传达的信息是______。' }
          ]
        },
        {
          stage: '第二段 · 举例论证',
          zh: '用一个具体例子（名人或亲身经历）支撑观点。例子要写细节，不要空谈。',
          patterns: [
            { en: 'A case in point is ______.', zh: '一个恰当的例子是______。' },
            { en: 'Take ______ as an example.', zh: '以______为例。' },
            { en: 'His / Her experience well illustrates that ______.', zh: '他/她的经历很好地说明了______。' }
          ]
        },
        {
          stage: '第三段 · 联系自身',
          zh: '落到自己该怎么做，收尾升华。',
          patterns: [
            { en: 'As college students, we should bear this in mind and put it into practice.', zh: '作为大学生，我们应牢记于心并付诸实践。' },
            { en: 'Only by doing so can we achieve our goals and realize our potential.', zh: '只有这样我们才能达成目标、发挥潜能。' }
          ]
        }
      ]
    }
  ],

  /* ——— 连接词：让文章有层次，阅卷老师一眼能看到 ——— */
  linkers: {
    '递进': ['first and foremost', 'in addition', 'furthermore', 'moreover', 'what is more', 'besides'],
    '转折': ['however', 'nevertheless', 'on the contrary', 'in contrast', 'whereas', 'conversely'],
    '因果': ['therefore', 'consequently', 'as a result', 'thus', 'owing to', 'due to'],
    '举例': ['for instance', 'a case in point is', 'take ______ as an example', 'such as'],
    '总结': ['in conclusion', 'to sum up', 'all in all', 'taking all these into consideration'],
    '强调': ['indeed', 'above all', 'undoubtedly', 'it is worth noting that']
  },

  /* ——— 高级替换词：按词性分类，四六级写作提分最快的一招 ———
     每条 note 是用错频率最高的地方，考前扫一遍能少丢好几分。 */
  upgradeGroups: [
    {
      id: 'verb',
      name: '动词',
      desc: '把 get / make / help 这类「万能动词」换成精确的书面动词。',
      items: [
        { basic: 'get', better: ['obtain', 'acquire', 'attain', 'gain'] },
        { basic: 'make', better: ['render', 'generate', 'produce', 'give rise to'] },
        { basic: 'help', better: ['facilitate', 'contribute to', 'be conducive to', 'assist'],
          note: 'contribute to 和 be conducive to 后面都接动名词：contribute to improving。' },
        { basic: 'show', better: ['demonstrate', 'illustrate', 'reveal', 'indicate'] },
        { basic: 'cause', better: ['give rise to', 'result in', 'trigger', 'bring about'],
          note: 'give rise to 后面接「结果、现象」，不接人。' },
        { basic: 'solve', better: ['tackle', 'address', 'cope with', 'resolve'] },
        { basic: 'improve', better: ['enhance', 'optimize', 'refine', 'upgrade'] },
        { basic: 'use', better: ['utilize', 'employ', 'apply', 'make use of'],
          note: 'utilize 正式度很高，简单语境硬用反而别扭。别为了高级而滥用。' },
        { basic: 'need', better: ['require', 'necessitate', 'call for'] },
        { basic: 'think', better: ['hold the view that', 'be convinced that', 'maintain that'] },
        { basic: 'say', better: ['state', 'declare', 'point out', 'argue'] },
        { basic: 'change', better: ['transform', 'alter', 'modify', 'reshape'] },
        { basic: 'increase', better: ['rise', 'grow', 'soar', 'surge'],
          note: 'soar / surge 表示「急剧飙升」，平缓增长用 rise 或 grow 就够了。' },
        { basic: 'decrease', better: ['decline', 'drop', 'diminish', 'dwindle'] },
        { basic: 'develop', better: ['cultivate', 'foster', 'nurture'] },
        { basic: 'keep', better: ['maintain', 'preserve', 'retain'] },
        { basic: 'begin', better: ['commence', 'initiate', 'embark on'] },
        { basic: 'finish', better: ['complete', 'accomplish', 'fulfill'] },
        { basic: 'know', better: ['be aware of', 'be conscious of'] },
        { basic: 'worry', better: ['be concerned about', 'be anxious about'] },
        { basic: 'buy', better: ['purchase', 'acquire'] },
        { basic: 'choose', better: ['opt for', 'select'] },
        { basic: 'give', better: ['offer', 'provide', 'grant'] },
        { basic: 'let / allow', better: ['enable', 'permit', 'empower'],
          note: 'enable sb to do sth，注意有 to。' },
        { basic: 'take up (占)', better: ['account for', 'constitute', 'occupy'],
          note: 'account for 也表示「解释……的原因」，看语境。' }
      ]
    },
    {
      id: 'adj',
      name: '形容词',
      desc: '描述性质的地方最容易被阅卷老师看到，也最容易写得平庸。',
      items: [
        { basic: 'important', better: ['vital', 'crucial', 'essential', 'of great significance'],
          note: '固定搭配是 be of great significance to sb/sth，介词用 to。' },
        { basic: 'good', better: ['beneficial', 'rewarding', 'fruitful', 'desirable'] },
        { basic: 'bad', better: ['detrimental', 'adverse', 'undesirable', 'harmful'],
          note: '固定搭配是 be detrimental to，介词用 to。' },
        { basic: 'many', better: ['a considerable number of', 'a multitude of', 'numerous'],
          note: '只修饰可数名词复数。' },
        { basic: 'much', better: ['a great deal of', 'a substantial amount of'],
          note: '只修饰不可数名词。写成 a great deal of students 会被扣分。' },
        { basic: 'few', better: ['a limited number of', 'scarce', 'insufficient'] },
        { basic: 'big', better: ['substantial', 'considerable', 'enormous', 'immense'] },
        { basic: 'small', better: ['minor', 'slight', 'marginal', 'negligible'] },
        { basic: 'difficult', better: ['challenging', 'demanding', 'formidable', 'daunting'] },
        { basic: 'easy', better: ['straightforward', 'accessible', 'effortless'] },
        { basic: 'necessary', better: ['indispensable', 'imperative', 'requisite'] },
        { basic: 'clear', better: ['evident', 'apparent', 'manifest', 'conspicuous'] },
        { basic: 'different', better: ['diverse', 'distinct', 'varied'] },
        { basic: 'common', better: ['prevalent', 'widespread', 'commonplace', 'universal'] },
        { basic: 'useful', better: ['practical', 'instrumental', 'valuable'] },
        { basic: 'famous', better: ['renowned', 'distinguished', 'celebrated', 'prominent'] },
        { basic: 'rich', better: ['wealthy', 'affluent', 'prosperous'] },
        { basic: 'tired', better: ['exhausted', 'fatigued'] },
        { basic: 'surprised', better: ['astonished', 'astounded', 'startled'] },
        { basic: 'popular', better: ['well-received', 'favored', 'in great demand'] }
      ]
    },
    {
      id: 'adv',
      name: '副词与程度',
      desc: 'very 和 really 是最典型的「低分表达」，换成下面这些立刻不一样。',
      items: [
        { basic: 'very', better: ['exceedingly', 'remarkably', 'particularly', 'notably'] },
        { basic: 'really', better: ['genuinely', 'truly', 'indeed'] },
        { basic: 'quickly', better: ['rapidly', 'swiftly', 'at a rapid pace'] },
        { basic: 'more and more', better: ['increasingly', 'progressively'],
          note: 'increasingly 修饰形容词或动词：increasingly important / increasingly rely on。' },
        { basic: 'finally', better: ['ultimately', 'eventually', 'in the end'] },
        { basic: 'usually', better: ['generally', 'typically', 'in most cases'] },
        { basic: 'almost', better: ['virtually', 'practically'] },
        { basic: 'completely', better: ['entirely', 'thoroughly', 'utterly'] },
        { basic: 'often', better: ['frequently', 'on numerous occasions'] },
        { basic: 'a lot（修饰动词）', better: ['considerably', 'substantially', 'significantly'] }
      ]
    },
    {
      id: 'noun',
      name: '名词',
      desc: '让主语和宾语更准确、更书面，整句话的档次就上来了。',
      items: [
        { basic: 'problem', better: ['issue', 'challenge', 'obstacle', 'dilemma'] },
        { basic: 'way', better: ['approach', 'method', 'means', 'avenue'] },
        { basic: 'reason', better: ['factor', 'cause', 'justification'] },
        { basic: 'advantage', better: ['merit', 'strength', 'virtue', 'benefit'] },
        { basic: 'disadvantage', better: ['drawback', 'shortcoming', 'weakness'] },
        { basic: 'people', better: ['individuals', 'the public', 'citizens'],
          note: 'individuals 强调「个体」，泛指「人们」时 the public 或 people 更自然。' },
        { basic: 'thing', better: ['aspect', 'element', 'factor', 'matter'] },
        { basic: 'job', better: ['career', 'occupation', 'profession'],
          note: 'career 指长期职业生涯；occupation 是中性书面词，另有「占领」之义，注意语境。' },
        { basic: 'chance', better: ['opportunity', 'likelihood', 'prospect'] },
        { basic: 'result', better: ['outcome', 'consequence', 'implication'] }
      ]
    },
    {
      id: 'phrase',
      name: '短语与句式',
      desc: '整句替换，比只换单词更能提分。这些可以直接搬进作文。',
      items: [
        { basic: 'I think', better: ['From my perspective', 'As far as I am concerned', 'To my mind'] },
        { basic: 'because', better: ['owing to the fact that', 'in that', 'on account of'],
          note: 'in that 后面接完整句子；on account of 后面接名词或动名词。' },
        { basic: 'for example', better: ['a case in point is', 'to illustrate', 'for instance'] },
        { basic: 'more and more people', better: ['an increasing number of people', 'a growing proportion of the public'] },
        { basic: 'I agree', better: ['I am in favor of', 'I am inclined to agree that'] },
        { basic: 'I disagree', better: ['I take a different view', 'I beg to differ'] },
        { basic: 'It is important', better: ['It is of vital importance that', 'It is essential that'] },
        { basic: 'We should', better: ['It is advisable that we should', 'We are supposed to'] },
        { basic: 'There are many', better: ['There exist a considerable number of', 'There is a host of'] },
        { basic: 'In a word', better: ['To sum up', 'All things considered', 'Taking all these into consideration'] }
      ]
    }
  ],

  /* ——— 完整范文：把上面的模板真正用起来，看看一篇高分作文长什么样 ——— */
  samples: [
    {
      id: 's1',
      title: 'Should College Students Take Part-time Jobs?',
      titleZh: '大学生该不该做兼职？',
      type: '观点对比型',
      level: 'CET4',
      words: 156,
      en: `When it comes to whether college students should take part-time jobs, opinions vary from person to person. Some students hold the view that part-time work offers valuable practical experience, while others argue that it takes up too much time and affects their studies.

Those who advocate part-time jobs believe that such work allows students to put what they have learned into practice. By dealing with customers or working in a team, students can develop communication skills that can hardly be acquired from textbooks. However, opponents point out that many students end up exhausted and unable to concentrate on their courses.

As far as I am concerned, the advantages far outweigh the disadvantages, provided that a proper balance is kept. A well-planned part-time job can enrich college life, but academic study should always come first. Only in this way can we make the most of our college years.`,
      zh: `谈到大学生是否应该做兼职，人们看法不一。有些学生认为兼职能提供宝贵的实践经验，另一些人则主张它占用太多时间、影响学业。

支持兼职的人认为，这类工作能让学生把所学付诸实践。在与顾客打交道或团队协作的过程中，学生可以培养出课本上很难获得的沟通能力。然而，反对者指出，许多学生最终疲惫不堪，无法专注于课程。

就我而言，只要保持恰当的平衡，利远大于弊。一份规划合理的兼职可以丰富大学生活，但学业始终应该放在第一位。只有这样，我们才能充分利用大学时光。`,
      highlights: [
        { en: 'When it comes to whether college students should take part-time jobs, opinions vary from person to person.', why: '开头段万能句式，任何观点对比题都能直接套用，一句话点题。' },
        { en: 'Some students hold the view that..., while others argue that...', why: '一句话摆出双方观点。hold the view 比 think 书面，while 表对比。' },
        { en: 'Those who advocate part-time jobs believe that...', why: '论证第一个观点。advocate 比 support 更正式，是加分词。' },
        { en: 'As far as I am concerned, the advantages far outweigh the disadvantages, provided that...', why: '亮明立场 + provided that 引出条件，一句写出两层意思。' },
        { en: 'Only in this way can we make the most of our college years.', why: 'Only 引导的倒装句收尾，阅卷老师一眼就能看到。' }
      ]
    },
    {
      id: 's2',
      title: 'The Overuse of Smartphones on Campus',
      titleZh: '校园里的手机过度使用',
      type: '现象解释型',
      level: 'CET4',
      words: 158,
      en: `In recent years, the overuse of smartphones has become a common phenomenon on university campuses. It is widely observed that many students check their phones constantly, even during lectures and meals.

Several factors contribute to this trend, and the following ones are the most important. First and foremost, smartphones provide endless entertainment, ranging from short videos to mobile games, which is far more appealing than dull textbooks. In addition, many students lack self-control and turn to their phones whenever they feel bored or anxious.

Like a coin has two sides, this phenomenon has both positive and negative effects. While smartphones give us convenient access to information, excessive use harms our eyesight, sleep quality and face-to-face communication. Therefore, it is high time that we took effective measures. Setting a daily time limit and keeping phones away during study hours are simple yet useful. Only by using technology wisely can we truly benefit from it.`,
      zh: `近年来，手机过度使用已成为大学校园里的普遍现象。人们普遍注意到，许多学生不停查看手机，甚至在课堂上和吃饭时也是如此。

有几个因素促成了这一趋势，以下最为重要。首先，手机提供从短视频到手游的无穷娱乐，远比枯燥的课本有吸引力。此外，许多学生缺乏自控力，一感到无聊或焦虑就转向手机。

正如硬币有两面，这一现象既有积极影响也有消极影响。手机让我们便捷地获取信息，但过度使用会损害视力、睡眠质量和面对面交流。因此，我们该采取有效措施了。设定每日使用时限、学习时把手机放远，简单却有效。只有明智地使用技术，我们才能真正从中受益。`,
      highlights: [
        { en: 'In recent years, ... has become a common phenomenon on university campuses.', why: '现象解释型的标准开头，直接套用。' },
        { en: 'Several factors contribute to this trend, and the following ones are the most important.', why: '承上启下句，自然引出原因，比 "There are many reasons" 高级。' },
        { en: 'First and foremost, ... In addition, ...', why: '原因分层。First and foremost 是阅卷老师最认的递进结构词。' },
        { en: 'Like a coin has two sides, this phenomenon has both positive and negative effects.', why: '一分为二看问题，体现辩证思维，是六级也常用的句子。' },
        { en: 'It is high time that we took effective measures.', why: '注意从句用过去式 took，这是虚拟语气的固定搭配，用对了是亮点。' }
      ]
    },
    {
      id: 's3',
      title: 'Changes in the Ways People Travel',
      titleZh: '人们出行方式的变化',
      type: '图表作文',
      level: 'CET4',
      words: 152,
      en: `As is vividly shown in the chart, the ways people travel in our city have changed greatly over the past decade. The number of people choosing private cars rose sharply, increasing from 25 percent in 2013 to 45 percent in 2023. Meanwhile, the proportion of those taking public transport dropped from 50 percent to 35 percent.

What has caused this change? Several reasons can be listed as follows. First and foremost, the improvement of living standards has made cars affordable for ordinary families. In addition, the expansion of the subway network has not kept pace with the growing population, which makes public transport less convenient than before.

Based on the analysis above, we can predict that this trend will continue in the years to come unless effective measures are taken. It is reasonable to believe that promoting green travel will be of great significance to the sustainable development of our city.`,
      zh: `如图表生动显示的，我们城市人们的出行方式在过去十年发生了巨大变化。选择私家车的人数急剧上升，从 2013 年的 25% 增至 2023 年的 45%。与此同时，乘坐公共交通的比例从 50% 下降到 35%。

是什么导致了这一变化？原因可列举如下。首先，生活水平的提高使普通家庭也买得起汽车。此外，地铁网络的扩张未能跟上人口增长，使公共交通不如从前便利。

基于以上分析，我们可以预测，除非采取有效措施，这一趋势在今后数年仍将持续。有理由相信，倡导绿色出行对我们城市的可持续发展意义重大。`,
      highlights: [
        { en: 'As is vividly shown in the chart, ...', why: '图表作文固定开头。注意是 As is，不是 As it is。' },
        { en: 'increasing from 25 percent in 2013 to 45 percent in 2023', why: '用分词短语补充数据，比再写一个句子简洁。' },
        { en: 'What has caused this change? Several reasons can be listed as follows.', why: '设问过渡，把描述图表自然转向分析原因。' },
        { en: 'has not kept pace with the growing population', why: 'keep pace with 是"跟上"的地道表达，比 catch up with 更书面。' },
        { en: 'we can predict that this trend will continue in the years to come unless effective measures are taken.', why: '预测趋势 + unless 条件，图表作文结尾的标准写法。' }
      ]
    },
    {
      id: 's4',
      title: 'A Letter of Suggestion to the University Library',
      titleZh: '致校图书馆的建议信',
      type: '应用文 · 书信',
      level: 'CET4',
      words: 118,
      en: `Dear Sir or Madam,

I am writing to express my suggestions concerning the service of our university library.

To begin with, the opening hours are too short during the examination period. Many students have to leave before they finish their revision. I would therefore suggest extending the closing time to eleven o'clock at night during that period. Furthermore, the seats near the windows are always occupied, partly because some students leave their books there for hours. It would be helpful if a seat reservation system could be introduced.

I would appreciate it if you could take my suggestions into consideration. I am looking forward to your early reply.

Yours sincerely,
Li Ming`,
      zh: `尊敬的先生/女士：

我写信是想就校图书馆的服务提出一些建议。

首先，考试期间开馆时间太短。许多学生还没复习完就不得不离开。因此我建议在考试期间把闭馆时间延长到晚上十一点。此外，靠窗的座位总是被占用，部分原因是有些学生把书放在那里好几个小时。如果能引入座位预约系统将会很有帮助。

如果您能考虑我的建议，我将不胜感激。期待您的早日回复。

您真诚的，
李明`,
      highlights: [
        { en: 'I am writing to express my suggestions concerning...', why: '书信开头必须一句话说明写信目的，这是格式分。' },
        { en: 'To begin with, ... Furthermore, ...', why: '建议分层，一段一个要点，条理清晰。' },
        { en: 'I would therefore suggest extending the closing time to...', why: 'suggest doing 结构。注意 suggest 后接动名词，不接 to do。' },
        { en: 'It would be helpful if a seat reservation system could be introduced.', why: '提建议的委婉句式，比 You should 礼貌得多。' },
        { en: 'I would appreciate it if you could take my suggestions into consideration.', why: '书信结尾万能句，注意 it 不能省略。' }
      ]
    },
    {
      id: 's5',
      title: 'Where There Is a Will, There Is a Way',
      titleZh: '有志者事竟成',
      type: '谚语警句型',
      level: 'CET4',
      words: 152,
      en: `The proverb "Where there is a will, there is a way" has been widely quoted for generations. Simple as the saying is, its meaning is profound and far-reaching. It conveys the message that a strong determination can help people overcome almost any obstacle.

A case in point is the Chinese scientist Tu Youyou. When she and her team were searching for a cure for malaria, they failed hundreds of times and worked with very limited equipment. Yet she never gave up, and after decades of effort she finally discovered artemisinin, which has saved millions of lives. Her experience well illustrates that perseverance matters far more than talent.

As college students, we should bear this in mind and put it into practice. When facing difficulties in our studies, we ought to set clear goals and keep moving forward. Only by doing so can we achieve our goals and realize our potential.`,
      zh: `"有志者事竟成"这句谚语世代传诵。这句话虽然简单，含义却深刻而深远。它传达的信息是：坚定的决心能帮助人们克服几乎任何障碍。

一个恰当的例子是中国科学家屠呦呦。当她和团队寻找疟疾疗法时，失败了数百次，设备也极为有限。然而她从未放弃，经过数十年的努力，她最终发现了青蒿素，拯救了数百万人的生命。她的经历很好地说明，毅力远比天赋重要。

作为大学生，我们应牢记于心并付诸实践。当学业遇到困难时，我们应当设定明确目标并持续前进。只有这样，我们才能达成目标、发挥潜能。`,
      highlights: [
        { en: 'Simple as the saying is, its meaning is profound and far-reaching.', why: 'as 引导的倒装让步状语从句，是谚语类作文最经典的开头句。' },
        { en: 'It conveys the message that...', why: '阐释谚语含义的固定句式。' },
        { en: 'A case in point is...', why: '举例论证的标准开头，比 For example 更书面。' },
        { en: 'Her experience well illustrates that perseverance matters far more than talent.', why: '例子之后必须有一句点题，否则例子白写。' },
        { en: 'Only by doing so can we achieve our goals and realize our potential.', why: 'Only + 介词短语引导倒装，结尾升华。' }
      ]
    },
    {
      id: 's6',
      title: 'Artificial Intelligence and Learning',
      titleZh: '人工智能与学习',
      type: '观点对比型',
      level: 'CET6',
      words: 168,
      en: `When it comes to the influence of artificial intelligence on learning, opinions vary from person to person. Some people hold the view that AI has revolutionized education by making personalized tutoring accessible to everyone, while others argue that it encourages laziness and undermines independent thinking.

Those who advocate AI-assisted learning believe that intelligent tools can adapt to each learner's pace, identify weaknesses and provide instant feedback, which traditional classrooms can hardly achieve. Nevertheless, opponents contend that students who rely excessively on such tools may gradually lose the ability to think critically and solve problems on their own.

As far as I am concerned, the advantages far outweigh the disadvantages, provided that AI is treated as a supplement rather than a substitute. What truly matters is not whether we use these tools, but how we use them. Therefore, it is high time that universities attached greater importance to guiding students in the proper use of AI. Only in this way can technology genuinely serve education.`,
      zh: `谈到人工智能对学习的影响，人们看法不一。有些人认为 AI 通过让人人享有个性化辅导而革新了教育，另一些人则主张它助长惰性、削弱独立思考。

支持 AI 辅助学习的人认为，智能工具能适应每个学习者的节奏、识别薄弱环节并即时反馈，这是传统课堂很难做到的。然而反对者主张，过度依赖这类工具的学生可能逐渐丧失批判性思考和独立解决问题的能力。

就我而言，只要把 AI 当作补充而非替代，利远大于弊。真正重要的不是我们是否使用这些工具，而是如何使用。因此，大学该更加重视引导学生正确使用 AI 了。只有这样，技术才能真正服务于教育。`,
      highlights: [
        { en: 'AI has revolutionized education by making personalized tutoring accessible to everyone', why: 'revolutionize 与 accessible 都是六级高分词，by doing 表方式。' },
        { en: 'intelligent tools can adapt to each learner\'s pace, identify weaknesses and provide instant feedback, which traditional classrooms can hardly achieve', why: '三个动词并列 + which 非限制性定语从句总结，句式有层次。' },
        { en: 'opponents contend that...', why: 'contend 是六级议论文常考动词，替换 argue/say。' },
        { en: 'provided that AI is treated as a supplement rather than a substitute', why: 'supplement / substitute 一对高级词，rather than 表取舍。' },
        { en: 'What truly matters is not whether we use these tools, but how we use them.', why: '主语从句 + not...but... 结构，是全文最有分量的一句，建议直接背。' }
      ]
    }
  ],

  /* ——— 考场时间分配 ——— */
  examTips: [
    '作文是整张卷子的第一部分，开考后 30 分钟内必须写完，答完立即收答题卡 1。',
    '动笔前花 3 分钟列提纲：三段各写什么、用哪个模板、准备哪些高级词。',
    '三段式是安全牌，但每段至少 3 句，总词数 120–180 词（四级）/ 150–200 词（六级）。',
    '宁可句式简单、用词准确，也不要为了长难句写出语法错误——错误扣分远大于简单句的损失。',
    '留 2 分钟通读检查：主谓一致、时态、单复数、拼写。这三类错误扣分最凶。'
  ]
};
