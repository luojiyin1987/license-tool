const optionValue = {
    q1: [
      { value: "q1strong_careless", text: "我不在乎" },
      {
        value: "q1strong_1",
        text: "只选择流行并广泛使用或带有强烈社区支持的许可协议",
      },
      { value: "q1strong_0", text: "选择所有许可协议" },
    ],
    q2a: [
      { value: "q2anocopyleft_0", text: "我想对代码的重复使用设置许可条件" },
      { value: "q2anocopyleft_1", text: "我不想对代码的重复使用设置许可条件" },
    ],
    q2b: [
      { value: "q2bstrong_1", text: "强著佐权 （Copyleft）" },
      { value: "q2bweak_1", text: "弱著佐权 （Copyleft）" },
    ],
    q2c: [
      { value: "q2cmod_1", text: "模块级别" },
      { value: "q2cfile_1", text: "文件级别" },
      { value: "q2clib_1", text: "库接口级别" },
    ],
    q3: [
      { value: "q3juris_careless", text: "我不在乎——即使指定了境外地址" },
      { value: "q3juris_0", text: "我想使用未涉及该话题的许可协议" },
      { value: "q3juris_1", text: "我想将自己所在区域作为司法管辖区" },
    ],
    q4a: [
      {
        value: "q4apat_careless",
        text: "我不在乎——我想自己并不拥有专利，即使有也不在乎怎样处理它们",
      },
      {
        value: "q4apat_0",
        text: "我想使用未涉及专利授权的许可协议，虽然它可能已授权专利",
      },
      { value: "q4apat_1", text: "我想使用明确授予专利权的许可协议（如果有）" },
    ],
    q4b: [
      { value: "q4bpatret_careless", text: "我不在乎——请提供全部许可协议" },
      { value: "q4bpatret_1", text: "我想使用包含专利报复条款的许可协议" },
      { value: "q4bpatret_0", text: "我想使用未包含专利报复条款的许可协议" },
    ],
    q5: [
      { value: "q5enhattr_careless", text: "我不在乎——请提供全部许可协议" },
      { value: "q5enhattr_1", text: "我想使用指定“增强型归属”的许可协议" },
      { value: "q5enhattr_0", text: "我想使用未指定“增强型归属”的许可协议" },
    ],
    q6: [
      { value: "q6noloophole_careless", text: "我不在乎——请提供全部许可协议" },
      { value: "q6noloophole_1", text: "我想使用解决“隐私漏洞”的许可协议" },
      { value: "q6noloophole_0", text: "我想使用未解决“隐私漏洞”的许可协议" },
    ],
    q7: [
      { value: "q7nopromo_careless", text: "我不在乎——请提供全部许可协议" },
      { value: "q7nopromo_1", text: "我想使用禁止推广的许可协议" },
      { value: "q7nopromo_0", text: "我想使用未禁止推广的许可协议" },
    ],
  };

  const licenceTips = {
    q1: [
      {
        text: "您想将结果限定为开放源代码促进会（OSI）所描述的“流行并广泛使用，或拥有广泛社区群”的许可协议吗？",
      },
      {
        text: "这将以牺牲一些更冷僻但或许有用的特征为代价来确保该许可协议成为“主流”协议。",
      },
    ],
    q2a: [
      {
        text: "所有自由和开源许可协议允许他人对您的代码进行修改，并且将修改版本提供给第三方使用。您的许可协议可以附加条件——明确指出哪些许可协议可用于这些修改版。这些条件可使您的代码保持自由，但也会使有些人无法重复使用您的代码。",
      },
      { text: "您想对代码的重复使用设置许可条件吗？" },
      { text: "如果不设置，您的许可协议就将成为“获准”许可协议之一。" },
    ],
    q2b: [
      { text: "只有选择了包含再用许可条件时才需回答此问题。" },
      {
        text: "您选择包含特定的再用许可条件。这些条件有时被称为“著佐权”，分为两种基本类型。",
      },
      {
        text: "强著佐权：如果一个软件项目包含您的部分代码，则整个项目都必须按照您最初的许可协议方式对外发行（如果发行的话）。其结果是，此代码的所有新增源代码都是公开可获取的。",
      },
      {
        text: "弱著佐权：如果一个软件项目包含您的部分代码，则项目中您原始创作的部分必须按照您最初的许可协议方式对外发行（如果发行的话），而其它部分的发行许可协议则由项目人自由选择，即使这部分作为整体只是您代码的更改版本。其结果是，此代码的部分新增源代码可能无法公开获取。",
      },
      {
        text: "如果您在前一个问题中选择包含许可条件：您想要哪种形式的著佐权？",
      },
    ],
    q2c: [
      { text: "只有前一个问题的答案为“弱著佐权”时，才需回答此问题。" },
      { text: "“弱著佐权”的定义如下：" },
      {
        text: "弱著佐权：如果一个软件项目包含您的部分代码，则项目中您原始创作的部分必须按照您最初的许可协议方式对外发行（如果发行的话），而其它部分的发行许可协议则由项目人自由选择，即使这部分作为整体只是您代码的更改版本。其结果是，此代码的部分新增源代码可能无法公开获取。",
      },
      {
        text: "现在，我们需要确定，修改版的哪些部分可以适用其它许可协议（不同于您原始的许可协议）：",
      },
      {
        text: "模块级：将项目中各功能代码段（“模块”）视为相互独立的部分。如果一个模块包含您的某些代码，那么该模块需使用您的许可协议。否则，代码的作者可自由选择适用的许可协议。",
      },
      {
        text: "文件级：将项目中由计算机文件系统唯一标志的代码-数据组合（“文件”）视为相互独立的部分。如果一个文件包含您的某些代码，那么该文件需使用您的许可协议。否则，代码的作者可自由选择适用的许可协议。",
      },
      {
        text: "库接口级：您的代码被视为软件库——可由其它程序通过指定接口使用的软件功能集。对库的所有修改，如需发行，则必须按照您最初的许可协议对外发行。使用您的库、并可能连同库一起发行的程序则不需要。",
      },

      {
        text: "如果您在前一个问题中选择“弱著佐权”，请问您想要哪种形式的弱著佐权？我们需要确定，修改版的哪些部分可以适用不同的许可协议。",
      },
      { text: "我们需要确定，修改版的哪些部分可以携带不同的许可。" },
    ],

    q3: [
      {
        text: "司法管辖区域 指的是一个特定区域或领域及其法律体系。当某个许可协议指定了司法管辖区时，许可人和被许可人达成共识：双方应依照该区域的法律法规对该许可协议条款进行解释，如有违反该许可协议的条款，应在该司法管辖区区域内诉诸采取法律途径解决行动。举例来说，如果一个英国人按照Mozilla 公共许可协议 v1.1许可代码，之后发现有人在未遵守该许可协议条件的情况下使用其代码，英国人应在位于加州圣克拉拉县的北加州联邦法院对该违约人提起法律诉讼。但是请注意，自由和开源软件所有者一般不会向违反许可条款者要求金钱赔偿，只是要求违约人同意遵守条款或终止使用相关代码。因此通常不需要真的将违约人告上法庭，尤其在需要维护公众形象和声誉的情况下。通常，只要向对方发出守约要求就很有效。如若不然，公开其违约行为也可促使对方遵守约定。",
      },
      {
        text: "不是所有自由和开源软件许可协议都会指定一个司法管辖区。实际上，大部分许可协议并未涉及。在这种情况下，必要时您可选择任何司法管辖区。但是，很有可能您要起诉的人会拒绝应诉，或者因为您选择的管辖地不利于他们而提出管辖权异议。",
      },
      {
        text: "最后，部分自由和开源软件许可协议规定，司法管辖区的选择权归许可人所有，或自动认定为许可人住所地（居住地或营业场所所在地）。",
      },
      { text: "您想如何在您的许可协议中规定司法管辖权问题呢？" },
    ],
    q4a: [
      {
        text: "您或您所在的机构拥有任何软件专利吗？如果有，并且根据自由或开源软件许可协议发布了相关代码，那么您极有可能授权一群人使用与该代码相关的专利权——即使该许可协议并没有明确说明。在很多区域，比如英国和美国，许可某人执行某项特定的操作（如复制或改写代码），意味着默示许可其采用一切必要的步骤来实现该操作。几乎可以肯定，这些默示许可的步骤包含了软件专利的使用。请注意，改写您代码的人不能通过扩展其功能来获取您的其他软件专利——您授权的只是已发布代码对应的专利，不包括该代码的其他任何形式。",
      },
      {
        text: "部分自由和开源软件许可协议对于专利授权没有任何明文规定——但是，如上文所述，这并不意味着他们未授予专利权。",
      },
      {
        text: "部分自由和开源软件许可协议明确地授予必要的专利权，以使用、改写以及发行该软件。",
      },
      { text: "您对所需许可协议的专利授权问题持何种态度呢？" },
    ],
    q4b: [
      {
        text: "自由或开源软件许可协议中也可以包含“专利报复”的条款。此类条款的基本含义是，任何提起法律诉讼称被许可的软件包含其某一项专利的人将失去您之前许可其复制、使用、改编和发行代码的权利。该条款用于阻止人们提起此类法律诉讼。",
      },
      { text: "您对于在许可中使用专利报复条款有何看法？" },
    ],
    q5: [
      {
        text: "所有自由或开源软件许可协议指定，任何人发行或改写软件都必须在其发布内容中署名软件的原作者。部分自由或开源软件许可协议更进一步要求这种认可必须采取特定的形式或者出现在特定情形中，例如在每次软件运行时出现在用户界面。这种规定有时被称为“增强型归属",
      },
      { text: "(enhanced attribution)”或勋章授予 (badge ware)“。" },
      { text: "您的许可协议需要规定“增强型归属(enhanced attribution)”吗？" },
    ],
    q6: [
      {
        text: "如果有人改写和完善您的代码，创建在线服务或者内部解决方案，大部分自由和开源软件许可协议并未规定，改写版或增强版代码的源代码必须对外发布。大部分自由和开源软件许可协议规定发行的条件是源代码必须已发布。通常，使用代码在网络上提供服务，或者在某个机构内部配置代码，都不被认定为这些许可协议定义的发布代码。自由和开源软件社区中部分成员，认为这些也被称为”应用服务提供商（ASP）漏洞“或”隐私漏洞“的现象有待解决。他们的观点是，为公平起见，所有受益于代码的人都必须通过他们的工作回馈社会，即使严格意义上来说他们并没有发布代码。",
      },
      {
        text: "为了解决这个问题，部分自由或开源软件许可协议将源代码的发布设为代码散布、内部配置和/或使用软件提供网络服务的前提条件，尤其当这种代码是网络服务的基础代码或者可能在内部使用。",
      },
      { text: "想让您的许可协议不存在“隐私漏洞”现象吗？" },
    ],
    q7: [
      {
        text: "部分自由和开源软件许可协议明确禁止利用原创作者的名字推广基于该作者的代码提供的产品或服务。",
      },
      { text: "您的许可协议需要引入“禁止推广“条款吗？" },
    ],
  };

  export   {optionValue, licenceTips}