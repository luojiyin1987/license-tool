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

export default function Home() {
  const [step,setStep]=useState(0);
  const now = 16;
 
  let choose: string | null = null;

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
