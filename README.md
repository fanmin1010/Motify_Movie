# Motify

Motify is an AWS-concatenated, NativeScript-powered, fully-scalable movie explorer mobile application with microservices architecture.

  - COMS 6998 Cloud Computing & Big Data Final Project
  - Team **Yulong Qiao yq2212**, **Lan Qing ql2282**, **Min Fan mf3084** and **Xiyan Liu xl2672**

### Features
  - Microservice Architecture
    - Components seperated by business context, communicating using well-defined API
    - Utilize AWS Lambda to depoly backend functions and AWS DynamoDB for data persistence.
    - Apache Spark running on Google Dataproc to implement Machine Learning
  - Hybrid Mobile Application powered by NativeScript
    - Code once, deploy on both iOS and Android.
    - Written using Angular 2 and TypeScript
  - Machine Learning Implementation to toggle movie recommendations for specific user
    - Collaborative Filtering with Matrix Factorization techniques for recommendation
    - Alternating Least Square for parallelized Stochastic Gradient Descent for Spark
 

### Architecture Design

This application is supported with various AWS components:
![Motify Architecture](https://cldup.com/Ir6c51ZDkO.png)

### Tech Stack
Motify uses multiple technologies to be fruitful:
* [NativeScript with Angular] - Building hybrid mobile application
* [TMDB] - awesome movie database supporting multiple APIs
* [AWS API Gateway] - Management tool for APIs used in this app
* [AWS Lambda] - Serverless. Implement business functions
* [AWS DynamoDB] - Powerful nonrelational database to persist information
* [AWS S3] - sum of AWS storage
* [GCP Dataproc]- Spark environment, great automation support
* [GCP Cloud Storage] - Movie training data rendering
* [Apache Spark] - inplementing Collaborative Filtering with Matrix Factorization


### Installation

Prior to running our mobile app, make sure you have following dependencies installed and corresponding environment variables set up
- Java 8 ,JDK 1.8 and environment variable ```JAVA_HOME```
- Node.js, npm
- Android SDK with minimum API level 17
  - Install [Android Studio] first
  - then use AVD manager to install Android SDK & create simulator
- NativeScript, see below MacOS installation guides

##### NativeScript
To install NativeScript CLI, run
```sh
$ npm install -g nativescript
```

To install iOS & Android dependencies, run
```sh
$ ruby -e "$(curl -fsSL https://www.nativescript.org/setup/mac)"
```

Verify setup, run
```sh
$ tns doctor
```
if shell echos ```No issues were detected```, then we are done.

### Notes about running our App
1. Please keep in mind the that App folder should always be named ```Motify``` since it binds with our appId in building.
The folder structure should appear as
```
          Motify
          ├── README.md
          ├── app
          ├── hooks
          ├── lib
          ├── package.json
          ├── references.d.ts
          └── tsconfig.json
 ```
2. Since NativeScript use a lazy bulding scheme, to completely rebuild app:
   ```sh
   $ rm -rf node_modules && rm -rf platforms && npm i
   $ tns run ios (tns run android)
   ```
3. The [NativeScript OAuth] plugin we used for third-party login is currently fail on Android devices
4. We might delete our credentials for
   - facebook login
   - AWS and GCP components
   - TMDB API keys
   For details, please check our code.


### Demo
Motify Demo: Click [here] to visit

See full demo slide deck at Google Doc: https://goo.gl/QCtUNz

### License

MIT






[NativeScript with Angular]:<https://docs.nativescript.org/angular/start/introduction.html>
[TMDB]:<https://www.themoviedb.org/?language=en>
[AWS API Gateway]:<https://aws.amazon.com/api-gateway/>
[AWS Lambda]:<https://aws.amazon.com/lambda/>
[AWS DynamoDB]:<https://aws.amazon.com/dynamodb/>
[AWS S3]:<https://aws.amazon.com/s3/>
[GCP Dataproc]:<>
[GCP Cloud Storage]:<https://cloud.google.com/storage/>
[Android Studio]:<https://developer.android.com/studio/index.html>
[NativeScript OAuth]:<https://www.npmjs.com/package/nativescript-oauth>
[Apache Spark]:<https://cloud.google.com/dataproc/>
[here]:<https://www.youtube.com/watch?v=9ynb7r7j3aQ>
