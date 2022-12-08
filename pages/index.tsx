import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import source from "../styles/Source.module.css";

import {
  Container,
  Row,
  Col,
  ProgressBar,
  Dropdown,
  DropdownButton,
  Button,
} from "react-bootstrap";

import allLicences from "../components/matrix.json" assert { type: "json" };
import { optionValue, licenseTips } from "../components/helper";
import { generateKey } from "crypto";

export interface LicenceInfo {
  feed: Feed;
}

export interface Feed {
  id: string;
  updated: string;
  category: string;
  title: string;
  link: string[];
  author: Author;
  totalResults: number;
  startIndex: number;
  entry: Entry[];
}

export interface Entry {
  id: string;
  updated: string;
  category: string;
  title: string;
  content: string;
  link: string;
  name: string;
  aka: string;
  q1strong: any;
  q2anocopyleft: any;
  q2bweak: any;
  q2bstrong: any;
  q2cmod: any;
  q2clib: any;
  q2cfile: any;
  q3juris: any;
  q3specjuris: string;
  q4apat: any;
  q4bpatret: any;
  q5enhattr: any;
  q6noloophole: any;
  q7nopromo: any;
}

export interface Author {
  name: string;
  email: string;
}

let scores: { title: string; score: number }[] = [];
let licenseKeyInfo: { [key: string]: { [key: string]: string } } = {};

let loadedLicenceData: Entry[] = [];
let loadedLimitedLicenceData: {}[] = [];

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

const choices1:{[key: string]: string| number} = {
  q1strong: "",
  q2anocopyleft: "",
  q2bweak: "",
  q2bstrong: "",
  q2cmod: "",
  q2clib: "",
  q2cfile: "",
  q3juris: "",
  q3specjuris: "",
  q4apat: "",
  q4bpatret: "",
  q5enhattr: "",
  q6noloophole: "",
  q7nopromo: "",
};

const DONT_CARE: string = "careless";
const qs: string[] = [
  "q2a",
  "q2b",
  "q2c",
  "q3",
  "q4a",
  "q4b",
  "q5",
  "q6",
  "q7",
];

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
const steps = ["q1", "q2a", "q2b", "q2c", "q3", "q4a", "q4b", "q5", "q6", "q7"];

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

const conditionsReuseQs: string[] = [
  TWO_NO_COPYLEFT,
  TWO_STRONG_COPYLEFT,
  TWO_WEAK_COPYLEFT,
  TWO_WEAK_MODULE,
  TWO_WEAK_FILE,
  TWO_WEAK_LIB,
];

const simpleYesNoQs: string[] = [
  THREE_JURISDICTION,
  FOUR_GRANT_PATENTS,
  FOUR_PATENT_RET,
  FIVE_ENHANCED_ATTR,
  SIX_NO_LOOPHOLE,
  SEVEN_NO_PROMO,
];

const limitingQs: string[] = [ONE_STRONG_LICENCES];

function initLicences(scoresallLicences: LicenceInfo): void {
  loadedLicenceData = allLicences.feed.entry;
  //console.log("allLicences", allLicences.feed.entry);
  console.log("scores before", scores);
  scores = initScores(allLicences.feed.entry);
  licenseKeyInfo = genLicenseKeyInfo(loadedLicenceData);
  //console.log("loadedLicenceData", loadedLicenceData)
  console.log("------------------");
  //console.log("scores", scores);
  displayLicences();
  //loadedLicenceData.forEach(calculateScoresForLicence);
}

function initScores(allApplicableLicences: Entry[]) {
  const temp = allApplicableLicences.map(function (item) {
    return {
      title: item.title,
      score: 100,
    };
  });
  console.log("initScores, scores temp", temp);
  return temp;
}

function genLicenseKeyInfo(loadedLicenceData: Entry[]): { [key: string]: {} } {
  const licenseKeyInfo: { [key: string]: {} } = {};

  for (const licenseInfo of loadedLicenceData) {
    const temp: { [key: string]: string } = {};
    console.log("generateLicenseKeyInfo licenseInfo", licenseInfo);
    genLicenceType(licenseInfo);
    temp["type"] = genLicenceType(licenseInfo);
    temp["popular"] = genYesOrNo(licenseInfo, "q1strong");
    temp["jurisdiction"] = getJurisdiction(licenseInfo);

    temp["patentable"] = genYesOrNo(licenseInfo, "q4apat");
    temp["patentRetaliationClause"] = genYesOrNo(licenseInfo, "q4bpatret");
    temp["enhancedOwnership"] = genYesOrNo(licenseInfo, "q5enhattr");
    temp["privacyLoophole"] = genYesOrNo(licenseInfo, "q6noloophole");
    temp["noPromote"] = genYesOrNo(licenseInfo, "q7nopromo");

    licenseKeyInfo[licenseInfo.title] = temp;
  }
  console.log("genLicenseKeyInfo", licenseKeyInfo);
  return licenseKeyInfo;
}

function genLicenceType(licenseInfo: Entry): string {
  console.log("licenseInfo.q2anocopyleft", licenseInfo.q2anocopyleft);
  if (licenseInfo.q2anocopyleft == 1) {
    return "Permissive";
  } else if (licenseInfo.q2bstrong == 1) {
    return "Strong copyleft";
  } else if (licenseInfo.q2bweak == 1 && licenseInfo.q2cmod == 1) {
    return "Weak copyleft - Module level";
  } else if (licenseInfo.q2bweak == 1 && licenseInfo.q2clib == 1) {
    return "Weak copyleft - Library Interface Level";
  } else if (licenseInfo.q2bweak == 1 && licenseInfo.q2cfile == 1) {
    return "Weak copyleft - File Level";
  }
  return "Copyleft";
}

function getJurisdiction(licenseInfo: Entry): string {
  if (licenseInfo.q3juris == 1) {
    return licenseInfo.q3specjuris || "careless";
  }
  return "careless";
}

function genYesOrNo(licenseInfo: Entry, key: keyof Entry): string {
  if (licenseInfo[key] == 1) {
    return "Yes";
  }
  return "No";
}

function processChoice(formFieldId: string, fullChoice: string) {
  choices[formFieldId] = fullChoice;
  console.log("processChoice choices", choices[formFieldId]);
  //console.log("isLimitingQuestion(fullChoice)", isLimitingQuestion(fullChoice));

  //第一个问题选择 想过处理
  if (isLimitingQuestion(fullChoice)) prepareLicencesList(fullChoice);

  updateForm(fullChoice);

  //displayLicences();
}

function processChoice1()

function isLimitingQuestion(question: string) {
  console.log("isLimitingQuestion question", question);
  return limitingQs.includes(question.split("_")[0]);
}

function prepareLicencesList(fullChoice: string) {
  const choice: number | string = fullChoice.split("_")[1];
  //console.log("loadedLicenceData prepareLicencesList", loadedLicenceData);
  console.log("prepareLicencesList choice", choice);
  if (Number(choice) !== 1) initScores(loadedLicenceData);
  // limit list of licences to those matching the req.
  // else
  //   initScores(
  //     loadedLimitedLicenceData.length
  //       ? loadedLimitedLicenceData
  //       : loadedLicenceData.filter(function (item) {
  //           return 1 == processLimitingQuestion(fullChoice, item);
  //         })
  //   );
}

function processLimitingQuestion(fullChoice: string, licenceData): number {
  const choiceInfo: string[] = fullChoice.split("_");

  let newMatch = 0;
  //console.log("processLimitingQuestion licenceData", licenceData, choiceInfo);
  if (Number(choiceInfo[1]) != 1 || licenceData.content.includes(choiceInfo[0]))
    newMatch++;

  //console.log("processLimitingQuestion newMatch", newMatch);
  return newMatch;
}

function updateForm(fullChoice: string): void {
  const choiceInfo = fullChoice.split("_");
  console.log(
    "updateForm, fullChoice choiceInfo,TWO_NO_COPYLEFT",
    choiceInfo,
    TWO_NO_COPYLEFT
  );

  if (choiceInfo[0] == TWO_NO_COPYLEFT) {
    if (Number(choiceInfo[1]) === 0) {
      openBox("q2b");
      closeBox("q2c");
    } else {
      closeBox("q2b");
      closeBox("q2c");
    }
  } else if (choiceInfo[0] == "q2bstrong") closeBox("q2c");
  else if (choiceInfo[0] == "q2bweak") openBox("q2c");
  else if (choiceInfo[0] == "q4apat")
    if (choiceInfo[1] == "careless" || Number(fullChoice[1]) === 1)
      openBox("q4b");
    else closeBox("q4b");

  console.log("updateForm, qs choices", choices);
}

function openBox(boxId: string): void {
  console.log("openBox boxId", boxId);
  enabledSteps(qs.indexOf(boxId) + 1, true);
  // console.log("               steps", steps);
  // console.log("openBox stepsEnabled", stepsEnabled);
}

function closeBox(boxId: string): void {
  choices[boxId] = null;

  enabledSteps(qs.indexOf(boxId) + 1, false);
}

function enabledSteps(index: number, enabled: boolean): void {
  stepsEnabled[index] = enabled;
}

function displayLicences() {
  console.log("displayLicences scores orgin", scores);
  loadedLicenceData.forEach(calculateScoresForLicence);
  console.log("beforedisplayLicences scores ", scores);
  scores.sort(sortScores);
  //console.log("displayLicences scores", scores);

  const score_list = {};

  for (var i = 0; i < scores.length; i++)
    score_list[scores[i].title] = calculateScore(
      loadedLicenceData.find(function (item) {
        return item.title === scores[i].title;
      })
    ).text;

  console.log("displayLicences scores", scores);
  // console.log("displayLicences score_list", score_list);
}

function calculateScoresForLicence(licenceData) {
  if (Object.values(choices).every((value) => value === null)) {
    scores.forEach(function (item) {
      if (item.title === licenceData.title) item.score = 100;
    });
    return;
  }

  let nrAnswers = 0,
    nrMatches = 0,
    score = 100;

  qs.forEach(function (item) {
    //console.log("item", item);
    let fullChoice = choices[item];
    //console.log("fullChoice", fullChoice);
    //console.log(fullChoice == null);
    if (fullChoice == null) return;

    const myChoice = fullChoice.split("_")[0];

    // choice made

    //console.log("myChoice", myChoice);
    if (myChoice != -1) {
      nrAnswers++;
      //console.log("myChoice != -1 licenceData", licenceData);
      nrMatches = calculateQuestion(fullChoice, licenceData, nrMatches);
    }
  });

  if (nrAnswers > 0) score = parseInt((nrMatches / nrAnswers) * 20) * 5;

  // console.log("nrAnswers", nrAnswers, score, nrMatches);
  // console.log("calculateScoresForLicence scores", scores)
  scores.forEach(function (item) {
    if (item.title === licenceData.title) item.score = score;
  });
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
  const choiceInfo = fullChoice.split("_");
  // console.log("calculateQuestion fullChoice", fullChoice, licenceData);
  // console.log("calculateQuestion choiceInfo", choiceInfo);
  // console.log("calculateQuestion fullChoice.join('_')",choiceInfo.join('_') )
  if (simpleYesNoQs.includes(choiceInfo[0]))
    nrMatches += processSimpleYesNo(choiceInfo[0], choiceInfo[1], licenceData);
  else if (isLimitingQuestion(fullChoice))
    nrMatches += processLimitingQuestion(choiceInfo, licenceData);
  else if (conditionsReuseQs.includes(choiceInfo[0]))
    nrMatches += processConditionsOnReuseQuestion(
      choiceInfo[0],
      choiceInfo[1],
      licenceData
    );

  return nrMatches;
}

function processSimpleYesNo(simpleQid, choice, licenceData): number {
  let newMatch = 0,
    licenceYes = licenceData.content.includes(simpleQid);

  if (
    (Number(choice) == 1 && licenceYes) ||
    (Number(choice) == 0 && !licenceYes) ||
    choice == DONT_CARE
  )
    newMatch++;
  //console.log("processSimpleYesNo newMatch", newMatch);
  return newMatch;
}

function processConditionsOnReuseQuestion(simpleQid, choice, licenceData) {
  //console.log("processConditionsOnReuseQuestion licenceData", licenceData);
  let newMatch = 0,
    questionMatch = licenceData.content.includes(simpleQid);

  if (Number(choice) == 1 && questionMatch) newMatch++;

  // set q2b and q2c to 'not applicable'
  if (simpleQid == TWO_NO_COPYLEFT && Number(choice) == 0 && !questionMatch)
    newMatch++;
  //console.log("processConditionsOnReuseQuestion newMatch", newMatch);
  return newMatch;
}
initLicences(allLicences);
export default function Home() {
  const [currStepIndex, setCurrStepIndex] = useState(0);
  const [Text, setText] = useState("下一步");

  const now = 15;

  let choose: string | null = null;

  function getStepIndex(direction: string) {
    let newStep: number | undefined = 0;
    console.log("getStepIndex currStepIndex", currStepIndex);
    if (direction === "prev") {
      for (let i = 0; i < stepsEnabled.length; i++) {
        if (stepsEnabled[i]) {
          if (newStep === currStepIndex - 1) {
            console.log("getStepIndex newStep steps", newStep, steps[newStep]);
            return i;
          }
          newStep++;
        }
      }
    } else {
      console.log("setps", steps);
      console.log("Enabl", stepsEnabled);
      for (let i = 0; i < stepsEnabled.length; i++) {
        if (stepsEnabled[i]) {
          //console.log("i stepsEnabled[i] newStep", i, stepsEnabled[i], newStep);
          if (newStep === currStepIndex) {
            console.log("getStepIndex newStep steps", newStep, steps[i]);
            return i;
          }
          newStep++;
        }
      }
    }

    return newStep;
  }

  const handleSelect = (e: string) => {
    console.log("handleSelect e", e);

    // console.log("currStepIndex", currStepIndex);
    // console.log("nest",getStepIndex("next"))
    // console.log("steps[getStepIndex]",steps[getStepIndex("next")]);
    const choice = steps[getStepIndex("next")];
    console.log("handleSelect choice,e", choice, e);
    processChoice(choice, e);
  };

  const getNext = (e) => {
    console.log("---------------getNext");
    console.log("button e", e);

    console.log("getNext,currStepIndex ", currStepIndex);
    if (steps[getStepIndex("next")] === steps[steps.length - 1]) {
      setText("结束");
    } else {
      setCurrStepIndex(currStepIndex + 1);
    }
    displayLicences();
  };

  return (
    <div className={styles.container}>
      <h2>开源许可证选择器</h2>
      <p>
        该工具旨在帮助用户理解他们自己对于自由和开源软件许可协议的偏好。用户必须自己阅读这些许可协议。在将许可协议适用于您的财产之前，阅读并完全理解您选择的许可协议是非常重要的。支撑该工具运行的许可类型分类，会不可避免地有些缩减。因此，不能也切不可将该工具的输出信息视为法律意见。
      </p>
      <h4 className="warning black">切记：必须阅读并理解您选择的许可协议。</h4>
      <div>
        {licenseTips[steps[getStepIndex("next")]].map((tip) => (
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
            {optionValue[steps[getStepIndex("next")]].map((info) => (
              <Dropdown.Item eventKey={info.value}>{info.text}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className={styles.footer}>
        <Button variant="primary" onClick={getNext}>
          {Text}
        </Button>{" "}
      </div>

      <div className={source["screening-results"]}>
        <p>筛选结果</p>
        <div id={source["screening-results-inner"]}>
          {scores.map((score) => (
            <div className={`${source["result"]} ${source["folding"]}`}>
              <div className={source["portlet-header"]}>
                <div className="title">
                  <span>{score.title} </span>
                  <span>{score.score} </span>
                </div>
              </div>
              <div>
                <ul>
                  <li>许可协议类型: {licenseKeyInfo[score.title].type}</li>
                  <li>流行并广泛使用: {licenseKeyInfo[score.title].popular}</li>
                  <li>
                    司法管辖区: {licenseKeyInfo[score.title].jurisdiction}
                  </li>
                  <li>授予专利权: {licenseKeyInfo[score.title].patentable}</li>
                  <li>
                    专利报复条款:{" "}
                    {licenseKeyInfo[score.title].patentRetaliationClause}
                  </li>
                  <li>
                    指定“增强型归属”:{" "}
                    {licenseKeyInfo[score.title].enhancedOwnership}
                  </li>
                  <li>
                    解决“隐私漏洞”:{" "}
                    {licenseKeyInfo[score.title].privacyLoophole}
                  </li>
                  <li>
                    指定“不推广”功能: {licenseKeyInfo[score.title].noPromote}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
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
