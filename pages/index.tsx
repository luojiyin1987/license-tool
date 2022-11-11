import Head from "next/head";
import Image from "next/image";
import React,{useState} from 'react';


import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  ProgressBar,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

import  allLicences from '../components/matrix.json' assert{type:'json'};


let loadedLicenceData:{}[] = [];
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

const stepsEnabled:boolean[] = [true, true, false, false, true, true, false, true, true, true];

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


function initLicences(allLicences):void {
  loadedLicenceData = allLicences.feed.entry;
  //console.log("allLicences", allLicences.feed.entry)
  initScores(allLicences.feed.entry);

  //console.log("loadedLicenceData", loadedLicenceData)
  console.log("------------------");
  console.log("scores", scores);
}

function initScores(allApplicableLicences):void {
  scores = allApplicableLicences.map(function (item) {
    return {
      title: item.title,
      score: -1,
    };
  });
}

function processChoice(formFieldId:string, fullChoice:string) {
  choices[formFieldId] = fullChoice;
  console.log("choices", choices[formFieldId]);
  console.log("isLimitingQuestion(fullChoice)", isLimitingQuestion(fullChoice));

  //第一个问题选择 想过处理
  if (isLimitingQuestion(fullChoice)) prepareLicencesList(fullChoice);

  updateForm(fullChoice);

  displayLicences();
}

function isLimitingQuestion(question:string) {
  return limitingQs.includes(question.split("_")[0]);
}

function prepareLicencesList(fullChoice:string) {
  const choice:number|string = fullChoice.split("_")[1];
  console.log("loadedLicenceData prepareLicencesList", loadedLicenceData);
  console.log("choice", choice);
  if ( Number(choice) !== 1) initScores(loadedLicenceData);
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

function processLimitingQuestion(fullChoice:string, licenceData) {
   const choiceInfo:string[] = fullChoice.split("_");

  let newMatch = 0;
  console.log("processLimitingQuestion licenceData", licenceData, choiceInfo);
  if (Number(choiceInfo[1]) != 1 || licenceData.content.includes(choiceInfo[0]))
    newMatch++;

  console.log("processLimitingQuestion newMatch", newMatch);
  return newMatch;
}

function updateForm(fullChoice:string) {
  const choiceInfo = fullChoice.split("_");
  console.log("updateForm, fullChoice", qs, choices, fullChoice);
  if (choiceInfo[0] == TWO_NO_COPYLEFT) {
    if (Number( choiceInfo[1]) === 0) {
      openBox("q2b");
      closeBox("q2c");
    } else {
      closeBox("q2b");
      closeBox("q2c");
    }
  } else if (choiceInfo[0] == TWO_STRONG_COPYLEFT) closeBox("q2c");
  else if (choiceInfo[0] == TWO_WEAK_COPYLEFT) openBox("q2c");
  else if (choiceInfo[0] == FOUR_GRANT_PATENTS)
    if (choiceInfo[1] == DONT_CARE || Number(fullChoice[1]) === 1) openBox("q4b");
    else closeBox("q4b");

  console.log("updateForm, qs choices", qs, choices);
}

function openBox(boxId:string) {
  
  enabledSteps(qs.indexOf(boxId) + 1, true);
}

function closeBox(boxId:string) {
  choices[boxId] = null;
  enabledSteps(qs.indexOf(boxId) + 1, false);
}

 function enabledSteps(index:number, enabled:boolean) {
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

    var myChoice = fullChoice.split("_")[0];

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

function processSimpleYesNo(simpleQid, choice, licenceData):number {
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
  const [step,setStep]=useState(0);
  const now = 16;
 
  let choose: string | null = null;
  //initLicences(allLicences);
  const steps = ['1', '2-1', '2-2', '2-3', '3', '4-1', '4-2', '5', '6', '7'],
  stepsEnabled = [true, true, false, false, true, true, false, true, true, true],
  stepHistory:number[] = [];

  let currStepIndex:number = -1;
  const  enabledSteps =(index:number, enabled:boolean)=> {
    stepsEnabled[index] = enabled;
  };
  const getStepIndex = (direction:string)=> {
    let newStep;

    if(!direction && currStepIndex == -1) {
      newStep = 0;
      stepHistory.push(newStep);
    }  else if(direction== 'prev') {
      newStep = stepHistory.pop() &&  stepHistory[stepHistory.length -1] 
    } 

     else {
        newStep = (function() {
          for(let  i=stepHistory.slice(-1)[0] + 1; i < stepsEnabled.length; i++ ){
            if(stepsEnabled[i]) return i
          }

          return  -1
        })();
        stepHistory.push(newStep);
     }

     return newStep;
  }

  const switchStep=(stepIndex: number)=> {
      currStepIndex = stepIndex >=0? stepIndex: currStepIndex;
  }

  
  const optionValue = [
    [
      { value: "q1strong_careless", text: "我不在乎" },
      {
        value: "q1strong_1",
        text: "只选择流行并广泛使用或带有强烈社区支持的许可协议",
      },
      { value: "q1strong_0", text: "选择所有许可协议" },
      
    ],
    [
      { value: "q2anocopyleft_0", text: "我想对代码的重复使用设置许可条件" },
      { value: "q2anocopyleft_1", text: "我不想对代码的重复使用设置许可条件" },
    ],
    [

      {value:"q2bstrong_1", text:"强著佐权 （Copyleft）"},
      {value:"q2bweak_1", text:"弱著佐权 （Copyleft）"}
    ],
    [
      {value:"q2cmod_1", text:"模块级别"},
      {value:"q2cfile_1", text:"文件级别"},
      {Value:"q2clib_1", text:"库接口级别"}
    ],
    [
      {value:"q3juris_careless",text:"我不在乎——即使指定了境外地址"},
      {value:"q3juris_0", text:"我想使用未涉及该话题的许可协议"},
      {value:"q3juris_1", text:"我想将自己所在区域作为司法管辖区"}
    ],
    [
      {value:"q4apat_careless", text:"我不在乎——我想自己并不拥有专利，即使有也不在乎怎样处理它们"},
      {value:"q4apat_0", text:"我想使用未涉及专利授权的许可协议，虽然它可能已授权专利"},
      {value:"q4apat_1", text:"我想使用明确授予专利权的许可协议（如果有）"}
    ],
    [
      {value:"q4bpatret_careless", text:"我不在乎——请提供全部许可协议"},
      {value:"q4bpatret_1", text:"我想使用包含专利报复条款的许可协议"},
      {value:"q4bpatret_0", text:"我想使用未包含专利报复条款的许可协议"}
    ],
    [
      {value:"q6noloophole_careless", text:"我不在乎——请提供全部许可协议"},
      {value:"q6noloophole_1", text:"我想使用解决“隐私漏洞”的许可协议"},
      {value:"q6noloophole_0", text:"我想使用未解决“隐私漏洞”的许可协议"}
    ],
    [
      {value:"q7nopromo_careless", text:"我不在乎——请提供全部许可协议"},
      {value:"q7nopromo_1",text:"我想使用禁止推广的许可协议"},
      {value:"q7nopromo_0", text:"我想使用未禁止推广的许可协议"}
    ]

  ];

  const handleSelect = (e:string) => {
    console.log(e);
    setStep(step+1)
    console.log('step', step)
  };

  return (
    <div className={styles.container}>
      <h2>开源许可证选择器</h2>
      <p>
        该工具旨在帮助用户理解他们自己对于自由和开源软件许可协议的偏好。用户必须自己阅读这些许可协议。在将许可协议适用于您的财产之前，阅读并完全理解您选择的许可协议是非常重要的。支撑该工具运行的许可类型分类，会不可避免地有些缩减。因此，不能也切不可将该工具的输出信息视为法律意见。
      </p>
      <h4 className="warning black">切记：必须阅读并理解您选择的许可协议。</h4>

      <div>
        <ProgressBar variant="success" now={40} />
        <ProgressBar
          id="select-step-progress"
          variant="info"
          now={(step + 1) * now}
          label={`第${step + 1}步`}
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
            {optionValue[step].map((info) => (
              <Dropdown.Item eventKey={info.value}>{info.text}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
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
