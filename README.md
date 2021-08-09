<!-- RESTful Q&A API -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/shale-rfe4/qanda">
    <img src="http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcTXqLCtTIJVMkp-ywPWa_aOmdB4XoAqH5maOZdmg1haILmb5DEWdS9UA-Mx3LDQtnPnj1qyjk2ip9KIZr-6_mg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Project Shale</h3>

  <p align="center">
    This project utilizes server design.
    <br />
    <a href="https://github.com/shale-rfe4/qanda"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/shale-rfe4/qanda">View Demo</a>
    ·
    <a href="https://github.com/melikaxo/hr-rfe4-shale/issues">




      rt Bug</a>
    ·
    <a href="https://github.com/melikaxo/hr-rfe4-shale/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
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
        <li><a href="#installation">Installation</a></li>
      </ul>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

* Design and multiple database options to analyze and compare, selecting one database option
* Transform the existing application data and load it into the database
* Design and build an API server to provide data to the client in the format specified by the API documentation
* Optimize your individual service by analyzing query times and server responses
* Deploy your service and integrate it successfully with the FEC web application
* Measure and improve the performance of your service at scale
* Work as a team and scale your application's architecture to support loads up to tens of thousands of requests per second.


### Built With

* PostGres

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/johnrlangford/hr-rfe4-shale
   ```
2. Install NPM packages
   ```sh
   npm install
   ```



## Developers

### API Routes


| List Questions |
| ------------------ | ----------------------------------------------------------------------|
| GET /qa/questions |
| product_id	 |  integer	   |   Specifies the product for which to retrieve questions. |
| page	       |  integer	  |    Selects the page of results to return. Default 1.|
| count	       |  integer	 |     Specifies how many results per page to return. Default 5. |
|
| Answers List
|   GET /qa/questions/:question_id/answers
|     Parameters
|       question_id 	integer	     	Required ID of the question for which answers are needed
|     Query Parameters
|       page	        integer	     	Selects the page of results to return. Default 1.
|       count     	  integer	     	Specifies how many results per page to return. Default 5.
|
| Add a Question
|   POST /qa/questions
|     body	          text	      	Text of question being asked
|     name	          text	      	Username for question asker
|     email	          text	       	Email address for question asker
|     product_id	    integer	     	Required ID of the Product for which the question is posted
|
| Add an Answer
|   POST /qa/questions/:question_id/answers
|     Parameters
|       question_id	  integer       Required ID of the question to post the answer for
|     Body Parameters
|       body	       text		        Text of question being asked
|       name	       text		        Username for question asker
|       email	       text		        Email address for question asker
|       photos	     [text]		      An array of urls corresponding to images to display
|
| Mark Question as Helpful
|   PUT /qa/questions/:question_id/helpful
|     question_id	   integer		    Required ID of the question to update
|
| Report Question
|   PUT /qa/questions/:question_id/report
|     question_id	   integer      	Required ID of the question to update
|
| Mark Answer as Helpful
|   PUT /qa/answers/:answer_id/helpful
|     answer_id   	  integer	      Required ID of the answer to update
|
| Report Answer
|   PUT /qa/answers/:answer_id/report
|     answer_id	      integer	      Required ID of the answer to update