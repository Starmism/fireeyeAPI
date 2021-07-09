<h3 align="center">FireEyeAPI</h3>

<p align="center">
    Google Data Studio Connector for FireEye Endpoint Security
    <br />
    <br />
</p>

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li>
          <a href="#installation">Installation</a>
          <ul>
            <li><a href="#on-the-command-line">On the command line</a></li>
            <li><a href="#on-google-scripts">On Google Scripts</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><a href="#resources">Resources</a></li>
  </ol>
</details>

## About The Project
fireeyeAPI is the source code for a Google Apps Code-built Google Data Studio Connector. It is used for connecting FireEye Endpoint Security to Google Data Studio for the creation of dynamically updated customized graphical dashboards.

![Example report](https://i.imgur.com/bwoEWEs.png)
_An example report that you could make using the data from this project._
<br />
<br />

### Built With
* [TypeScript](https://www.typescriptlang.org/)
* [node.js](https://nodejs.org/en/)
* [Google's clasp](https://github.com/google/clasp)

## Getting Started

### Prerequisites
* [node.js](https://nodejs.org/en/download/)
* Valid FireEye Endpoint Security license
* Installed FireEye Endpoint Security Modules
  - [Host Management](https://fireeye.market/apps/298195)
  - [API Documentation](https://fireeye.market/apps/qEoJkb2A)
* User account with API access role (_api_analyst_ or _api_admin_)
* Your Endpoint Security Server Base URL
  - Available in the FireEye Endpoint Security web console under <br />`Modules` -> `API Documentation`
    - It should look like: ```https://<endpoint security fqdn>```
    - There should be no trailing `/hx/api`
* Google Account
* Google Scripts API enabled (https://script.google.com/home/usersettings)
* ```clasp```

### Installation
#### On the command line
1. Download and unzip the archive from this page, or fork the repo and clone it locally
  ```sh
  git clone https://github.com/Starmism/fireeyeAPI.git
  ```
2. Install clasp
  ```sh
  npm install -g @google/clasp
  ```
3. Login with clasp
  ```sh
  clasp login
  ```
4. Navigate to the project directory
5. Create a project and select `Standalone` when prompted for type
  ```sh
  clasp create --title "FireEye Endpoint Security Host Management Connector"
  ```
6. Push the code to Google App Scripts
  ```sh
  clasp push
  ```
#### On [Google Scripts](https://script.google.com/home)
1. Switch to the `Legacy Editor`
2. Select `Publish` -> `Deploy from Manifest`
3. Click `Install add-on`
4. Expand `Latest Version (Head)`
5. Click the Data Studio URL it reveals
6. Input the FireEye Endpoint Security API URL you got from above as well as your api user's credentials and click `Connect`
7. Click `Create Report`
8. Make a beautiful report!

## Resources
[FireEye Developer Hub](https://fireeye.dev/docs/endpoint/)
<br />
[Endpoint API Documentation](https://docs.fireeye.com/docs/docs_en/HX/sw/2020.2/API/HX_API_2020.2_en.pdf) _(Login Required)_
