import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";


import {
  Container,
  Row,
  Col,
  ProgressBar,
  Dropdown,
  DropdownButton,
  Button
} from "react-bootstrap";

import allLicences from "../components/matrix.json" assert { type: "json" };
import { timeStamp } from "console";

let loadedLicenceData: {}[] = [];
let scores = [];
let loadedLimitedLicenceData = [];

const choices = {
  q1: null,
  q2a: null,
  q2b: null,
  q2c: null,
  q3: null,
  q4a: null,
  q4b: null,
  q5: null,
  q6: null,
  q7: null,
};

const DONT_CARE = "careless";
const qs = ["q2a", "q2b", "q2c", "q3", "q4a", "q4b", "q5", "q6", "q7"];

const stepsEnabled: boolean[] = [
  true,
  true,
  false,
  false,
  true,
  true,
  false,
  true,
  true,
  true,
];

const ONE_STRONG_LICENCES = "q1strong",
  TWO_NO_COPYLEFT = "q2anocopyleft",
  TWO_STRONG_COPYLEFT = "q2bstrong",
  TWO_WEAK_COPYLEFT = "q2bweak",
  TWO_WEAK_MODULE = "q2cmod",
  TWO_WEAK_FILE = "q2cfile",
  TWO_WEAK_LIB = "q2clib",
  THREE_JURISDICTION = "q3juris",
  FOUR_GRANT_PATENTS = "q4apat",
  FOUR_PATENT_RET = "q4bpatret",
  FIVE_ENHANCED_ATTR = "q5enhattr",
  SIX_NO_LOOPHOLE = "q6noloophole",
  SEVEN_NO_PROMO = "q7nopromo";

const conditionsReuseQs = [
  TWO_NO_COPYLEFT,
  TWO_STRONG_COPYLEFT,
  TWO_WEAK_COPYLEFT,
  TWO_WEAK_MODULE,
  TWO_WEAK_FILE,
  TWO_WEAK_LIB,
];

const simpleYesNoQs = [
  THREE_JURISDICTION,
  FOUR_GRANT_PATENTS,
  FOUR_PATENT_RET,
  FIVE_ENHANCED_ATTR,
  SIX_NO_LOOPHOLE,
  SEVEN_NO_PROMO,
];

const limitingQs = [ONE_STRONG_LICENCES];

function initLicences(allLicences): void {
  loadedLicenceData = allLicences.feed.entry;
  //console.log("allLicences", allLicences.feed.entry)
  initScores(allLicences.feed.entry);

  //console.log("loadedLicenceData", loadedLicenceData)
  console.log("------------------");
  console.log("scores", scores);
}

function initScores(allApplicableLicences): void {
  scores = allApplicableLicences.map(function (item) {
    return {
      title: item.title,
      score: -1,
    };
  });
}

function processChoice(formFieldId: string, fullChoice: string) {
  choices[formFieldId] = fullChoice;
  console.log("choices", choices[formFieldId]);
  console.log("isLimitingQuestion(fullChoice)", isLimitingQuestion(fullChoice));

  //第一个问题选择 想过处理
  if (isLimitingQuestion(fullChoice)) prepareLicencesList(fullChoice);

  updateForm(fullChoice);

  displayLicences();
}

function isLimitingQuestion(question: string) {
  return limitingQs.includes(question.split("_")[0]);
}

function prepareLicencesList(fullChoice: string) {
  const choice: number | string = fullChoice.split("_")[1];
  console.log("loadedLicenceData prepareLicencesList", loadedLicenceData);
  console.log("choice", choice);
  if (Number(choice) !== 1) initScores(loadedLicenceData);
  // limit list of licences to those matching the req.
  else
    initScores(
      loadedLimitedLicenceData.length
        ? loadedLimitedLicenceData
        : loadedLicenceData.filter(function (item) {
            return 1 == processLimitingQuestion(fullChoice, item);
          })
    );
}

function processLimitingQuestion(fullChoice: string, licenceData) {
  const choiceInfo: string[] = fullChoice.split("_");

  let newMatch = 0;
  console.log("processLimitingQuestion licenceData", licenceData, choiceInfo);
  if (Number(choiceInfo[1]) != 1 || licenceData.content.includes(choiceInfo[0]))
    newMatch++;

  console.log("processLimitingQuestion newMatch", newMatch);
  return newMatch;
}

function updateForm(fullChoice: string) {
  const choiceInfo = fullChoice.split("_");
  console.log("updateForm, fullChoice", qs, choices, fullChoice);
  if (choiceInfo[0] == TWO_NO_COPYLEFT) {
    if (Number(choiceInfo[1]) === 0) {
      openBox("q2b");
      closeBox("q2c");
    } else {
      closeBox("q2b");
      closeBox("q2c");
    }
  } else if (choiceInfo[0] == TWO_STRONG_COPYLEFT) closeBox("q2c");
  else if (choiceInfo[0] == TWO_WEAK_COPYLEFT) openBox("q2c");
  else if (choiceInfo[0] == FOUR_GRANT_PATENTS)
    if (choiceInfo[1] == DONT_CARE || Number(fullChoice[1]) === 1)
      openBox("q4b");
    else closeBox("q4b");

  console.log("updateForm, qs choices", qs, choices);
}

function openBox(boxId: string) {
  enabledSteps(qs.indexOf(boxId) + 1, true);
}

function closeBox(boxId: string) {
  choices[boxId] = null;
  enabledSteps(qs.indexOf(boxId) + 1, false);
}

function enabledSteps(index: number, enabled: boolean) {
  stepsEnabled[index] = enabled;
}

function displayLicences() {
  loadedLicenceData.forEach(calculateScoresForLicence);
  scores.sort(sortScores);
  console.log("displayLicences scores", scores);

  const score_list = {};

  for (var i = 0; i < scores.length; i++)
    score_list[scores[i].title] = calculateScore(
      loadedLicenceData.find(function (item) {
        return item.title === scores[i].title;
      })
    ).text;

  console.log("displayLicences scores", scores);
  console.log("displayLicences score_list", score_list);
}

function calculateScoresForLicence(licenceData) {
  console.log("calculateScoresForLicence , licenceData", licenceData);
  let nrAnswers = 0,
    nrMatches = 0,
    score = -1;
  console.log("qs", qs, choices);
  qs.forEach(function (item) {
    console.log("item", item);
    let fullChoice = choices[item];
    console.log("fullChoice", fullChoice);
    console.log(fullChoice == null);
    if (fullChoice == null) return;

    const myChoice = fullChoice.split("_")[0];

    // choice made

    console.log("myChoice", myChoice);
    if (myChoice != -1) {
      nrAnswers++;
      console.log("myChoice != -1 licenceData", licenceData);
      nrMatches = calculateQuestion(fullChoice, licenceData, nrMatches);
    }
  });

  if (nrAnswers > 0) score = nrMatches / nrAnswers;

  console.log("nrAnswers", nrAnswers, score, nrMatches);
  scores.forEach(function (item) {
    if (item.title === licenceData.title) item.score = score;
  });
  console.log("scores", scores);
}

function sortScores(a, b) {
  return a.score < b.score
    ? 1
    : a.score > b.score
    ? -1
    : a.title < b.title
    ? -1
    : a.title > b.title
    ? 1
    : 0;
}

function calculateScore(licenceData) {
  let scoreText = 0,
    nrAnswers = 0,
    nrMatches = 0;

  qs.forEach(function (item) {
    const fullChoice = choices[item];

    if (!(fullChoice != null)) return;

    const myChoice = fullChoice.split("_")[0];

    if (![-1, "na"].includes(myChoice)) {
      // choice made
      nrAnswers++;
      nrMatches = calculateQuestion(fullChoice, licenceData, nrMatches);
    }
  });

  if (nrAnswers == 0) {
    scoreText += 0;
  } else {
    scoreText += parseInt((nrMatches / nrAnswers) * 20) * 5;
  }

  return {
    matches: nrMatches,
    answers: nrAnswers,
    text: scoreText,
  };
}

function calculateQuestion(fullChoice, licenceData, nrMatches) {
  fullChoice = fullChoice.split("_");
  console.log("calculateQuestion fullChoice", fullChoice, licenceData);
  if (simpleYesNoQs.includes(fullChoice[0]))
    nrMatches += processSimpleYesNo(fullChoice[0], fullChoice[1], licenceData);
  else if (isLimitingQuestion(fullChoice.join("_")))
    nrMatches += processLimitingQuestion(fullChoice, licenceData);
  else if (conditionsReuseQs.includes(fullChoice[0]))
    nrMatches += processConditionsOnReuseQuestion(
      fullChoice[0],
      fullChoice[1],
      licenceData
    );

  return nrMatches;
}

function processSimpleYesNo(simpleQid, choice, licenceData): number {
  let newMatch = 0,
    licenceYes = licenceData.content.includes(simpleQid);

  if (
    (choice == 1 && licenceYes) ||
    (choice == 0 && !licenceYes) ||
    choice == DONT_CARE
  )
    newMatch++;
  console.log("processSimpleYesNo newMatch", newMatch);
  return newMatch;
}

function processConditionsOnReuseQuestion(simpleQid, choice, licenceData) {
  console.log("processConditionsOnReuseQuestion licenceData", licenceData);
  let newMatch = 0,
    questionMatch = licenceData.content.includes(simpleQid);

  if (choice == 1 && questionMatch) newMatch++;

  // set q2b and q2c to 'not applicable'
  if (simpleQid == TWO_NO_COPYLEFT && choice == 0 && !questionMatch) newMatch++;
  console.log("processConditionsOnReuseQuestion newMatch", newMatch);
  return newMatch;
}

export default function Home() {
  const [currStepIndex, setStep] = useState(0);
  
  const now = 16;

  let choose: string | null = null;
  // initLicences(allLicences);
  // processChoice("q1", "q1strong_careless");
  // processChoice("q2", "q2anocopyleft_0");
  const steps = ["q1", "q2a", "q2b","q3","q4a","q4b","q5","q6","q7"],
    stepsEnabled = [
      true,
      true,
      false,
      false,
      true,
      true,
      false,
      true,
      true,
      true,
    ],
    stepHistory: number[] = [];

 
  const enabledSteps = (index: number, enabled: boolean) => {
    stepsEnabled[index] = enabled;
  };
  const getStepIndex = (direction: string) => {
    let newStep;

    if (!direction && currStepIndex == -1) {
      newStep = 0;
      stepHistory.push(newStep);
    } else if (direction == "prev") {
      newStep = stepHistory.pop() && stepHistory[stepHistory.length - 1];
    } else {
      newStep = (function () {
        for (
          let i = stepHistory.slice(-1)[0] + 1;
          i < stepsEnabled.length;
          i++
        ) {
          if (stepsEnabled[i]) return i;
        }

        return -1;
      })();
      stepHistory.push(newStep);
    }

    return newStep;
  };

  const switchStep = (stepIndex: number) => {
    currStepIndex = stepIndex >= 0 ? stepIndex : currStepIndex;
  };

  const optionValue = {"q1":
    [
      { value: "q1strong_careless", text: "我不在乎" },
      {
        value: "q1strong_1",
        text: "只选择流行并广泛使用或带有强烈社区支持的许可协议",
      },
      { value: "q1strong_0", text: "选择所有许可协议" },
    ],
    "q2a":[
      { value: "q2anocopyleft_0", text: "我想对代码的重复使用设置许可条件" },
      { value: "q2anocopyleft_1", text: "我不想对代码的重复使用设置许可条件" },
    ],
    "q2b":[
      { value: "q2bstrong_1", text: "强著佐权 （Copyleft）" },
      { value: "q2bweak_1", text: "弱著佐权 （Copyleft）" },
    ],
    "q2c":[
      { value: "q2cmod_1", text: "模块级别" },
      { value: "q2cfile_1", text: "文件级别" },
      { Value: "q2clib_1", text: "库接口级别" },
    ],
    "q3":[
      { value: "q3juris_careless", text: "我不在乎——即使指定了境外地址" },
      { value: "q3juris_0", text: "我想使用未涉及该话题的许可协议" },
      { value: "q3juris_1", text: "我想将自己所在区域作为司法管辖区" },
    ],
    "q4a":[
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
    "q4b":[
      { value: "q4bpatret_careless", text: "我不在乎——请提供全部许可协议" },
      { value: "q4bpatret_1", text: "我想使用包含专利报复条款的许可协议" },
      { value: "q4bpatret_0", text: "我想使用未包含专利报复条款的许可协议" },
    ],
    "q5":[
      {value:"q5enhattr_careless", text:"我不在乎——请提供全部许可协议"},
      {value:"q5enhattr_1", text:"我想使用指定“增强型归属”的许可协议"},
      {value:"q5enhattr_0", text:"我想使用未指定“增强型归属”的许可协议"}
    ],
    "q6":[
      { value: "q6noloophole_careless", text: "我不在乎——请提供全部许可协议" },
      { value: "q6noloophole_1", text: "我想使用解决“隐私漏洞”的许可协议" },
      { value: "q6noloophole_0", text: "我想使用未解决“隐私漏洞”的许可协议" },
    ],
    "q7":[
      { value: "q7nopromo_careless", text: "我不在乎——请提供全部许可协议" },
      { value: "q7nopromo_1", text: "我想使用禁止推广的许可协议" },
      { value: "q7nopromo_0", text: "我想使用未禁止推广的许可协议" },
    ],
  };

  const licenceTips = { "q1":[
    {text:"您想将结果限定为开放源代码促进会（OSI）所描述的“流行并广泛使用，或拥有广泛社区群”的许可协议吗？"},
    {text:"这将以牺牲一些更冷僻但或许有用的特征为代价来确保该许可协议成为“主流”协议。"}
  ], "q2a":[
    {text:"所有自由和开源许可协议允许他人对您的代码进行修改，并且将修改版本提供给第三方使用。您的许可协议可以附加条件——明确指出哪些许可协议可用于这些修改版。这些条件可使您的代码保持自由，但也会使有些人无法重复使用您的代码。"},
    {text:"您想对代码的重复使用设置许可条件吗？"},
    {text:"如果不设置，您的许可协议就将成为“获准”许可协议之一。"}
  ], "q2b":[
    {text:"只有选择了包含再用许可条件时才需回答此问题。"},
    {text:"您选择包含特定的再用许可条件。这些条件有时被称为“著佐权”，分为两种基本类型。"},
    {text:"强著佐权：如果一个软件项目包含您的部分代码，则整个项目都必须按照您最初的许可协议方式对外发行（如果发行的话）。其结果是，此代码的所有新增源代码都是公开可获取的。"},
    {text:"弱著佐权：如果一个软件项目包含您的部分代码，则项目中您原始创作的部分必须按照您最初的许可协议方式对外发行（如果发行的话），而其它部分的发行许可协议则由项目人自由选择，即使这部分作为整体只是您代码的更改版本。其结果是，此代码的部分新增源代码可能无法公开获取。"},
    {text:"如果您在前一个问题中选择包含许可条件：您想要哪种形式的著佐权？"}
  ],"q2c":[
    {text:"只有前一个问题的答案为“弱著佐权”时，才需回答此问题。"},
    {text:"“弱著佐权”的定义如下："},
    {text:"弱著佐权：如果一个软件项目包含您的部分代码，则项目中您原始创作的部分必须按照您最初的许可协议方式对外发行（如果发行的话），而其它部分的发行许可协议则由项目人自由选择，即使这部分作为整体只是您代码的更改版本。其结果是，此代码的部分新增源代码可能无法公开获取。"},
    {text:"现在，我们需要确定，修改版的哪些部分可以适用其它许可协议（不同于您原始的许可协议）："},
    {text:"模块级：将项目中各功能代码段（“模块”）视为相互独立的部分。如果一个模块包含您的某些代码，那么该模块需使用您的许可协议。否则，代码的作者可自由选择适用的许可协议。"},
    {text:"文件级：将项目中由计算机文件系统唯一标志的代码-数据组合（“文件”）视为相互独立的部分。如果一个文件包含您的某些代码，那么该文件需使用您的许可协议。否则，代码的作者可自由选择适用的许可协议。"},
    {text:"库接口级：您的代码被视为软件库——可由其它程序通过指定接口使用的软件功能集。对库的所有修改，如需发行，则必须按照您最初的许可协议对外发行。使用您的库、并可能连同库一起发行的程序则不需要。"},

    {text:"如果您在前一个问题中选择“弱著佐权”，请问您想要哪种形式的弱著佐权？我们需要确定，修改版的哪些部分可以适用不同的许可协议。"},
    {text:"我们需要确定，修改版的哪些部分可以携带不同的许可。"}
  ],
  
  "q3":[
    {text:"司法管辖区域 指的是一个特定区域或领域及其法律体系。当某个许可协议指定了司法管辖区时，许可人和被许可人达成共识：双方应依照该区域的法律法规对该许可协议条款进行解释，如有违反该许可协议的条款，应在该司法管辖区区域内诉诸采取法律途径解决行动。举例来说，如果一个英国人按照Mozilla 公共许可协议 v1.1许可代码，之后发现有人在未遵守该许可协议条件的情况下使用其代码，英国人应在位于加州圣克拉拉县的北加州联邦法院对该违约人提起法律诉讼。但是请注意，自由和开源软件所有者一般不会向违反许可条款者要求金钱赔偿，只是要求违约人同意遵守条款或终止使用相关代码。因此通常不需要真的将违约人告上法庭，尤其在需要维护公众形象和声誉的情况下。通常，只要向对方发出守约要求就很有效。如若不然，公开其违约行为也可促使对方遵守约定。"},
    {text:"不是所有自由和开源软件许可协议都会指定一个司法管辖区。实际上，大部分许可协议并未涉及。在这种情况下，必要时您可选择任何司法管辖区。但是，很有可能您要起诉的人会拒绝应诉，或者因为您选择的管辖地不利于他们而提出管辖权异议。"},
    {text:"最后，部分自由和开源软件许可协议规定，司法管辖区的选择权归许可人所有，或自动认定为许可人住所地（居住地或营业场所所在地）。"},
    {text:"您想如何在您的许可协议中规定司法管辖权问题呢？"}
  ],"q4a":[
    {text:"您或您所在的机构拥有任何软件专利吗？如果有，并且根据自由或开源软件许可协议发布了相关代码，那么您极有可能授权一群人使用与该代码相关的专利权——即使该许可协议并没有明确说明。在很多区域，比如英国和美国，许可某人执行某项特定的操作（如复制或改写代码），意味着默示许可其采用一切必要的步骤来实现该操作。几乎可以肯定，这些默示许可的步骤包含了软件专利的使用。请注意，改写您代码的人不能通过扩展其功能来获取您的其他软件专利——您授权的只是已发布代码对应的专利，不包括该代码的其他任何形式。"},
    {text:"部分自由和开源软件许可协议对于专利授权没有任何明文规定——但是，如上文所述，这并不意味着他们未授予专利权。"},
    {text:"部分自由和开源软件许可协议明确地授予必要的专利权，以使用、改写以及发行该软件。"},
    {text:"您对所需许可协议的专利授权问题持何种态度呢？"}
  ],"q4b":[
    {text:"自由或开源软件许可协议中也可以包含“专利报复”的条款。此类条款的基本含义是，任何提起法律诉讼称被许可的软件包含其某一项专利的人将失去您之前许可其复制、使用、改编和发行代码的权利。该条款用于阻止人们提起此类法律诉讼。"},
    {text:"您对于在许可中使用专利报复条款有何看法？"}
  ],"q5":[
    {text:"所有自由或开源软件许可协议指定，任何人发行或改写软件都必须在其发布内容中署名软件的原作者。部分自由或开源软件许可协议更进一步要求这种认可必须采取特定的形式或者出现在特定情形中，例如在每次软件运行时出现在用户界面。这种规定有时被称为“增强型归属"},
    {text:"(enhanced attribution)”或勋章授予 (badge ware)“。"},
    {text:"您的许可协议需要规定“增强型归属(enhanced attribution)”吗？"}
  ],"q6":[
    {text:"如果有人改写和完善您的代码，创建在线服务或者内部解决方案，大部分自由和开源软件许可协议并未规定，改写版或增强版代码的源代码必须对外发布。大部分自由和开源软件许可协议规定发行的条件是源代码必须已发布。通常，使用代码在网络上提供服务，或者在某个机构内部配置代码，都不被认定为这些许可协议定义的发布代码。自由和开源软件社区中部分成员，认为这些也被称为”应用服务提供商（ASP）漏洞“或”隐私漏洞“的现象有待解决。他们的观点是，为公平起见，所有受益于代码的人都必须通过他们的工作回馈社会，即使严格意义上来说他们并没有发布代码。"},
    {text: "为了解决这个问题，部分自由或开源软件许可协议将源代码的发布设为代码散布、内部配置和/或使用软件提供网络服务的前提条件，尤其当这种代码是网络服务的基础代码或者可能在内部使用。"},
    {text:"想让您的许可协议不存在“隐私漏洞”现象吗？"}
  ], "q7": [
    {text:"部分自由和开源软件许可协议明确禁止利用原创作者的名字推广基于该作者的代码提供的产品或服务。"},
    {text:"您的许可协议需要引入“禁止推广“条款吗？"}
  ]

}


  const handleSelect = (e: string) => {
    
    console.log("handleSelect e",e);
    
  
    console.log("currStepIndex", currStepIndex);
    console.log("steps[step]",steps[currStepIndex]);
    const  choice = steps[currStepIndex];
    processChoice(choice ,e)
   
    
  };

  const getNext=(e)=>{
    console.log("button e", e)
    switchStep(getStepIndex('next'));
    setStep(currStepIndex+1)
  }

  return (
    <div className={styles.container}>
      <h2>开源许可证选择器</h2>
      <p>
        该工具旨在帮助用户理解他们自己对于自由和开源软件许可协议的偏好。用户必须自己阅读这些许可协议。在将许可协议适用于您的财产之前，阅读并完全理解您选择的许可协议是非常重要的。支撑该工具运行的许可类型分类，会不可避免地有些缩减。因此，不能也切不可将该工具的输出信息视为法律意见。
      </p>
      <h4 className="warning black">切记：必须阅读并理解您选择的许可协议。</h4>
      <div>
      {licenceTips[steps[currStepIndex]].map((tip) => (
              <p>{tip.text}</p>
            ))}
      </div>
      <div>
        <ProgressBar variant="success" now={40} />
        <ProgressBar
          id="select-step-progress"
          variant="info"
          now={(currStepIndex + 1) * now}
          label={`第${currStepIndex + 1}步`}
        />
      </div>
      <br />
      <div>
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle
            id="dropdown-basic-button"
            title={choose || "请选择"}
          >
            {choose || "请选择"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {optionValue[currStepIndex].map((info) => (
              <Dropdown.Item eventKey={info.value}>{info.text}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className={styles.footer}>
      <Button variant="primary"  onClick={getNext} >下一步</Button>{' '}
      </div>

      <div >
      <p>筛选结果</p>
      </div>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
