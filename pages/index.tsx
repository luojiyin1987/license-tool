import Head from "next/head";
import Image from "next/image";

import licenseInfo from "./license";

import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, ProgressBar, Dropdown, DropdownButton } from "react-bootstrap";

const now = 16;
let step = 1;
let choose = null;
export default function Home() {
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
          now={now}
          label={`第${step}步`}
        />
      </div>
      <br />
      <div>
        <DropdownButton id="dropdown-basic-button" title={choose || '请选择'}>
          <Dropdown.Item eventKey="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item eventKey="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item eventKey="#/action-3">Something else</Dropdown.Item>
        </DropdownButton>
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
