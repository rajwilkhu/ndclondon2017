# NDC London 2017 AWS Lambda and Azure Functions

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Frajwilkhu%2Fndclondon2017%2Fmaster%2Fazuredeploy.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>
<a href="http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2Frajwilkhu%2Fndclondon2017%2Fmaster%2Fazuredeploy.json" target="_blank">
    <img src="http://armviz.io/visualizebutton.png"/>
</a>

Code to support my presentation on AWS Lambda and Azure Functions at NDC London 2017. This codebase contains all the code for creating the AWS Lambdas using Serverless Framework 1.0, Azure Resource Manager templates for creating a functions app using the consumption hosting plan (dynamic).

AWS Lambda is a serverless compute service that runs your code in response to events and automatically manages the underlying compute resources for you.
Azure functions is a solution for easily running small pieces of code, or "functions," in the cloud. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it. For more information about Azure Functions, see the [Azure Functions Overview](https://azure.microsoft.com/en-us/documentation/articles/functions-overview/).

# Prerequisites

* Latest AWS SDK and CLI installed
* Node JS (> v4.3)
* Serverless Framework 1.0
* Azure functions cli